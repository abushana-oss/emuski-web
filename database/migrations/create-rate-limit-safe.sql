-- Fix: Drop ALL overloads of check_rate_limit_safe to resolve PGRST203
-- PostgREST error PGRST203 = "Could not choose the best candidate function"
-- This happens when multiple overloads exist with the same name.
-- Run this in Supabase SQL Editor.

-- Step 1: Drop every overload of check_rate_limit_safe regardless of signature
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT oid::regprocedure::text AS func_sig
    FROM pg_proc
    WHERE proname = 'check_rate_limit_safe'
      AND pronamespace = 'public'::regnamespace
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || r.func_sig || ' CASCADE';
    RAISE NOTICE 'Dropped: %', r.func_sig;
  END LOOP;
END $$;

-- Step 2: Ensure the rate_limits table has a unique constraint for ON CONFLICT
-- (safe to run even if it already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'rate_limits_identifier_hash_limit_type_key'
      AND conrelid = 'public.rate_limits'::regclass
  ) THEN
    ALTER TABLE public.rate_limits
      ADD CONSTRAINT rate_limits_identifier_hash_limit_type_key
      UNIQUE (identifier_hash, limit_type);
    RAISE NOTICE 'Added unique constraint on rate_limits(identifier_hash, limit_type)';
  ELSE
    RAISE NOTICE 'Unique constraint already exists — skipping';
  END IF;
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'rate_limits table does not exist — skipping constraint';
END $$;

-- Step 3: Create the single, unambiguous check_rate_limit_safe function
-- Signature matches exactly what rate-limiter.ts calls:
--   rpc('check_rate_limit_safe', { p_user_id, p_endpoint, p_requests_per_minute, p_requests_per_hour })
CREATE FUNCTION public.check_rate_limit_safe(
  p_user_id             text,
  p_endpoint            text,
  p_requests_per_minute integer DEFAULT 15,
  p_requests_per_hour   integer DEFAULT 100
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_identifier      text;
  v_identifier_hash text;
  v_minute_key      text;
  v_hour_key        text;
  v_minute_count    integer := 0;
  v_hour_count      integer := 0;
  v_now             timestamptz := now();
  v_minute_window   timestamptz := v_now - interval '1 minute';
  v_hour_window     timestamptz := v_now - interval '1 hour';
BEGIN
  -- Resolve identifier: user UUID or anonymous
  v_identifier      := COALESCE(p_user_id, 'anon');
  v_identifier_hash := encode(digest(v_identifier || ':' || p_endpoint, 'sha256'), 'hex');
  v_minute_key      := v_identifier_hash || ':minute';
  v_hour_key        := v_identifier_hash || ':hour';

  -- Count requests in per-minute window
  SELECT COALESCE(attempt_count, 0) INTO v_minute_count
  FROM public.rate_limits
  WHERE identifier_hash = v_minute_key
    AND limit_type = 'api_minute'
    AND window_start >= v_minute_window;

  -- Count requests in per-hour window
  SELECT COALESCE(attempt_count, 0) INTO v_hour_count
  FROM public.rate_limits
  WHERE identifier_hash = v_hour_key
    AND limit_type = 'api_hour'
    AND window_start >= v_hour_window;

  -- Deny if any limit exceeded
  IF v_minute_count >= p_requests_per_minute OR v_hour_count >= p_requests_per_hour THEN
    RETURN false;
  END IF;

  -- Upsert per-minute counter
  INSERT INTO public.rate_limits (identifier_hash, limit_type, attempt_count, window_start, created_at, updated_at)
  VALUES (v_minute_key, 'api_minute', 1, v_now, v_now, v_now)
  ON CONFLICT (identifier_hash, limit_type) DO UPDATE SET
    attempt_count = CASE
      WHEN public.rate_limits.window_start >= v_minute_window THEN public.rate_limits.attempt_count + 1
      ELSE 1
    END,
    window_start  = CASE
      WHEN public.rate_limits.window_start >= v_minute_window THEN public.rate_limits.window_start
      ELSE v_now
    END,
    updated_at = v_now;

  -- Upsert per-hour counter
  INSERT INTO public.rate_limits (identifier_hash, limit_type, attempt_count, window_start, created_at, updated_at)
  VALUES (v_hour_key, 'api_hour', 1, v_now, v_now, v_now)
  ON CONFLICT (identifier_hash, limit_type) DO UPDATE SET
    attempt_count = CASE
      WHEN public.rate_limits.window_start >= v_hour_window THEN public.rate_limits.attempt_count + 1
      ELSE 1
    END,
    window_start  = CASE
      WHEN public.rate_limits.window_start >= v_hour_window THEN public.rate_limits.window_start
      ELSE v_now
    END,
    updated_at = v_now;

  RETURN true;

EXCEPTION WHEN OTHERS THEN
  -- Fail-open: don't block users if rate limiting breaks
  RAISE WARNING 'check_rate_limit_safe error [%]: %', SQLSTATE, SQLERRM;
  RETURN true;
END;
$$;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION public.check_rate_limit_safe(text, text, integer, integer)
  TO authenticated, anon, service_role;

-- Step 5: Verify — should return 'true' (allowed)
SELECT public.check_rate_limit_safe(NULL, '/api/test', 15, 100) AS result;
