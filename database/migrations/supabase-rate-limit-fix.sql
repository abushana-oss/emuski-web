-- Fix rate limiting function and add debugging
-- Run this to fix the rate limit issues

-- First, let's see what's in the rate_limits table
-- You can run this separately to debug: SELECT * FROM public.rate_limits;

-- Drop and recreate the rate limit function with better error handling
DROP FUNCTION IF EXISTS public.check_rate_limit(text, text, integer, integer);

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  identifier text,
  limit_type text,
  max_attempts integer DEFAULT 3,
  window_minutes integer DEFAULT 60
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  identifier_hash text;
  current_count integer := 0;
  window_start timestamptz;
  blocked_until timestamptz;
  rate_record record;
BEGIN
  -- Input validation
  IF identifier IS NULL OR limit_type IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'invalid_input',
      'wait_seconds', 0,
      'attempts', 0
    );
  END IF;

  -- Create hash for privacy
  identifier_hash := encode(digest(lower(trim(identifier)), 'sha256'), 'hex');
  
  -- Get current rate limit record
  SELECT * INTO rate_record
  FROM public.rate_limits
  WHERE identifier_hash = check_rate_limit.identifier_hash 
    AND limit_type = check_rate_limit.limit_type;
  
  -- Extract values from record
  IF FOUND THEN
    current_count := rate_record.attempt_count;
    window_start := rate_record.window_start;
    blocked_until := rate_record.blocked_until;
  END IF;
  
  -- Check if currently blocked
  IF blocked_until IS NOT NULL AND blocked_until > now() THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'wait_seconds', EXTRACT(EPOCH FROM (blocked_until - now()))::integer,
      'attempts', current_count
    );
  END IF;
  
  -- If no record found or window expired, reset/create
  IF NOT FOUND OR window_start < now() - (window_minutes || ' minutes')::interval THEN
    -- Delete old record if exists
    DELETE FROM public.rate_limits 
    WHERE identifier_hash = check_rate_limit.identifier_hash 
      AND limit_type = check_rate_limit.limit_type;
    
    -- Create new record
    INSERT INTO public.rate_limits (
      identifier_hash, 
      limit_type, 
      attempt_count, 
      window_start,
      blocked_until,
      created_at,
      updated_at
    ) VALUES (
      identifier_hash, 
      limit_type, 
      1, 
      now(),
      NULL,
      now(),
      now()
    );
    
    RETURN jsonb_build_object(
      'allowed', true, 
      'reason', 'new_window',
      'wait_seconds', 0,
      'attempts', 1
    );
  END IF;
  
  -- Check if limit would be exceeded
  IF current_count >= max_attempts THEN
    -- Set block period (15 minutes)
    UPDATE public.rate_limits
    SET blocked_until = now() + interval '15 minutes',
        updated_at = now()
    WHERE identifier_hash = check_rate_limit.identifier_hash 
      AND limit_type = check_rate_limit.limit_type;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'wait_seconds', 900, -- 15 minutes
      'attempts', current_count
    );
  END IF;
  
  -- Increment attempt count
  UPDATE public.rate_limits
  SET attempt_count = attempt_count + 1,
      updated_at = now()
  WHERE identifier_hash = check_rate_limit.identifier_hash 
    AND limit_type = check_rate_limit.limit_type;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'reason', 'incremented', 
    'wait_seconds', 0,
    'attempts', current_count + 1
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error information for debugging
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'database_error',
      'error_code', SQLSTATE,
      'error_message', SQLERRM,
      'wait_seconds', 0,
      'attempts', 0
    );
END;
$$;

-- Function to clear rate limits (for testing/admin)
CREATE OR REPLACE FUNCTION public.clear_rate_limits(identifier text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    -- If not admin, only allow clearing own email (if we can determine it)
    IF identifier IS NULL THEN
      RAISE EXCEPTION 'Permission denied';
    END IF;
  END IF;
  
  -- Clear specific identifier or all
  IF identifier IS NOT NULL THEN
    DELETE FROM public.rate_limits 
    WHERE identifier_hash = encode(digest(lower(trim(identifier)), 'sha256'), 'hex');
  ELSE
    -- Only admins can clear all
    IF EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    ) THEN
      DELETE FROM public.rate_limits;
    ELSE
      RAISE EXCEPTION 'Admin permission required to clear all rate limits';
    END IF;
  END IF;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.clear_rate_limits(text) TO authenticated;

-- Test the function (you can run this separately)
-- SELECT public.check_rate_limit('test@example.com', 'email_signup', 3, 60);

DO $$
BEGIN
  RAISE NOTICE 'Rate limiting function fixed!';
  RAISE NOTICE 'You can now test the signup flow again.';
  RAISE NOTICE 'If you need to clear rate limits for testing, use:';
  RAISE NOTICE 'SELECT public.clear_rate_limits(''your@email.com'');';
END $$;