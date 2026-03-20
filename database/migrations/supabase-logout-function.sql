-- Add logout security functions to Supabase
-- Run this in your Supabase SQL Editor

-- Function to invalidate user sessions on logout
CREATE OR REPLACE FUNCTION public.invalidate_user_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  -- Only proceed if user is authenticated
  IF current_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Update user profile to track logout
  UPDATE public.user_profiles 
  SET updated_at = now()
  WHERE id = current_user_id;

  -- Clear any active sessions from our custom sessions table (if exists)
  UPDATE public.user_sessions 
  SET is_active = false,
      last_activity_at = now()
  WHERE user_id = current_user_id AND is_active = true;

  -- Log the logout event
  INSERT INTO public.security_events (
    user_id,
    email_hash,
    event_type,
    success,
    metadata,
    created_at
  )
  SELECT 
    current_user_id,
    encode(digest(lower(email), 'sha256'), 'hex'),
    'logout_completed',
    true,
    jsonb_build_object(
      'logout_time', now(),
      'user_agent', 'server_side'
    ),
    now()
  FROM public.user_profiles 
  WHERE id = current_user_id;

END;
$$;

-- Add logout event type to security events check constraint
-- First drop the existing constraint
ALTER TABLE public.security_events DROP CONSTRAINT IF EXISTS security_events_event_type_check;

-- Recreate with logout events included
ALTER TABLE public.security_events 
ADD CONSTRAINT security_events_event_type_check 
CHECK (event_type IN (
  'signup_attempt', 
  'login_attempt', 
  'password_reset_request',
  'logout_attempt',
  'logout_completed',
  'session_expired'
));

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.invalidate_user_sessions() TO authenticated;

-- Function to cleanup expired sessions (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark sessions as inactive if they haven't been used in 30 days
  UPDATE public.user_sessions 
  SET is_active = false
  WHERE is_active = true 
    AND last_activity_at < now() - interval '30 days';

  -- Delete very old session records (older than 90 days)
  DELETE FROM public.user_sessions 
  WHERE created_at < now() - interval '90 days';

  -- Log cleanup event
  INSERT INTO public.security_events (
    email_hash,
    event_type,
    success,
    metadata
  ) VALUES (
    encode(digest('system_cleanup', 'sha256'), 'hex'),
    'session_expired',
    true,
    jsonb_build_object(
      'cleanup_time', now(),
      'action', 'expired_sessions_cleanup'
    )
  );
END;
$$;

-- Grant execute permission for cleanup function
GRANT EXECUTE ON FUNCTION public.cleanup_expired_sessions() TO authenticated;

DO $$
BEGIN
  RAISE NOTICE 'Logout security functions created successfully!';
  RAISE NOTICE 'Features added:';
  RAISE NOTICE '✅ Session invalidation on logout';
  RAISE NOTICE '✅ Logout event logging';
  RAISE NOTICE '✅ Automatic session cleanup';
  RAISE NOTICE '✅ Enhanced security event types';
END $$;