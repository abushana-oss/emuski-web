-- Implement progressive rate limits with: 30 sec -> 1 min -> 15 min delays

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
  excess_attempts integer;
  penalty_seconds integer;
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
  WHERE public.rate_limits.identifier_hash = check_rate_limit.identifier_hash 
    AND public.rate_limits.limit_type = check_rate_limit.limit_type;
  
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
    WHERE public.rate_limits.identifier_hash = check_rate_limit.identifier_hash 
      AND public.rate_limits.limit_type = check_rate_limit.limit_type;
    
    -- Create new record with count 1
    INSERT INTO public.rate_limits (
      identifier_hash, limit_type, attempt_count, window_start, blocked_until, created_at, updated_at
    ) VALUES (
      identifier_hash, limit_type, 1, now(), NULL, now(), now()
    );
    
    RETURN jsonb_build_object(
      'allowed', true, 'reason', 'new_window', 'wait_seconds', 0, 'attempts', 1
    );
  END IF;

  -- Increment the attempt count
  current_count := current_count + 1;
  
  -- Calculate if we need to apply a penalty
  IF current_count > max_attempts THEN
    excess_attempts := current_count - max_attempts;
    
    -- Only block on odd excess attempts (1st, 3rd, 5th excess try).
    -- This guarantees they get 1 "free" try immediately after waiting out a penalty.
    IF excess_attempts % 2 = 1 THEN
      -- Determine progressive penalty length based on attempt number
      IF excess_attempts = 1 THEN
        penalty_seconds := 30; -- First penalty: 30 seconds
      ELSIF excess_attempts = 3 THEN
        penalty_seconds := 60; -- Second penalty: 1 minute
      ELSE
        penalty_seconds := 900; -- Third+ penalty: 15 minutes
      END IF;
      
      -- Set the block period
      UPDATE public.rate_limits
      SET attempt_count = current_count,
          blocked_until = now() + (penalty_seconds || ' seconds')::interval,
          updated_at = now()
      WHERE public.rate_limits.identifier_hash = check_rate_limit.identifier_hash 
        AND public.rate_limits.limit_type = check_rate_limit.limit_type;
      
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'rate_limited',
        'wait_seconds', penalty_seconds,
        'attempts', current_count
      );
    END IF;
  END IF;
  
  -- Update count if no block applied
  UPDATE public.rate_limits
  SET attempt_count = current_count,
      updated_at = now()
  WHERE public.rate_limits.identifier_hash = check_rate_limit.identifier_hash 
    AND public.rate_limits.limit_type = check_rate_limit.limit_type;
  
  RETURN jsonb_build_object(
    'allowed', true, 'reason', 'incremented', 'wait_seconds', 0, 'attempts', current_count
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'allowed', false, 'reason', 'database_error', 'error_code', SQLSTATE, 'error_message', SQLERRM, 'wait_seconds', 0, 'attempts', 0
    );
END;
$$;
