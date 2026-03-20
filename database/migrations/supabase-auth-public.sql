-- EMUSKI Secure Authentication System (Public Schema Only)
-- Works within standard Supabase permissions
-- Industry-standard security without auth schema modifications

-- ============================================================================
-- 1. BASIC SETUP
-- ============================================================================

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. EMAIL DOMAIN VALIDATION (Public Schema)
-- ============================================================================

-- Function to validate email domains (company emails only)
CREATE OR REPLACE FUNCTION public.is_valid_company_email(input_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  clean_email text;
  domain_part text;
  blocked_domains text[] := ARRAY[
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'live.com', 'aol.com', 'icloud.com', 'protonmail.com',
    'mail.com', 'zoho.com', 'yandex.com'
  ];
BEGIN
  -- Input validation
  IF input_email IS NULL OR length(trim(input_email)) = 0 THEN
    RETURN false;
  END IF;
  
  -- Normalize email
  clean_email := lower(trim(input_email));
  
  -- Basic email format validation
  IF NOT (clean_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') THEN
    RETURN false;
  END IF;
  
  -- Extract domain
  domain_part := split_part(clean_email, '@', 2);
  
  -- Validate domain exists
  IF domain_part IS NULL OR length(trim(domain_part)) = 0 THEN
    RETURN false;
  END IF;
  
  -- Check if domain is blocked (personal email providers)
  RETURN NOT (domain_part = ANY(blocked_domains));
END;
$$;

-- ============================================================================
-- 3. RATE LIMITING SYSTEM (Public Schema)
-- ============================================================================

-- Rate limiting table
CREATE TABLE IF NOT EXISTS public.email_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash text NOT NULL UNIQUE,
  attempt_count integer NOT NULL DEFAULT 1 CHECK (attempt_count >= 0 AND attempt_count <= 100),
  last_attempt timestamptz NOT NULL DEFAULT now(),
  cooldown_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  
  -- Security constraints
  CONSTRAINT valid_cooldown CHECK (cooldown_until IS NULL OR cooldown_until > last_attempt),
  CONSTRAINT valid_hash CHECK (length(email_hash) = 64) -- SHA-256 hex length
);

-- Secure indexes
CREATE INDEX IF NOT EXISTS idx_email_rate_limits_hash ON public.email_rate_limits(email_hash);
CREATE INDEX IF NOT EXISTS idx_email_rate_limits_cooldown ON public.email_rate_limits(cooldown_until) 
WHERE cooldown_until IS NOT NULL;

-- Enable RLS for rate limiting table
ALTER TABLE public.email_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow system functions to access rate limits
CREATE POLICY "system_only_rate_limits" ON public.email_rate_limits
  FOR ALL USING (false); -- No direct user access

-- Rate limit checking function
CREATE OR REPLACE FUNCTION public.check_email_rate_limit(input_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_hash text;
  current_record record;
  now_ts timestamptz := now();
  max_attempts constant integer := 3;
  cooldown_minutes constant integer := 15;
  reset_hours constant integer := 1;
BEGIN
  -- Input validation
  IF input_email IS NULL OR length(trim(input_email)) = 0 THEN
    RETURN jsonb_build_object('allowed', false, 'error', 'Invalid email');
  END IF;
  
  -- Create secure hash
  email_hash := encode(digest(lower(trim(input_email)), 'sha256'), 'hex');
  
  -- Get current record
  SELECT attempt_count, last_attempt, cooldown_until
  INTO current_record
  FROM public.email_rate_limits 
  WHERE email_hash = check_email_rate_limit.email_hash;
  
  -- No record exists - first attempt
  IF NOT FOUND THEN
    INSERT INTO public.email_rate_limits (email_hash, attempt_count, last_attempt)
    VALUES (email_hash, 1, now_ts);
    
    RETURN jsonb_build_object('allowed', true, 'attempts', 1);
  END IF;
  
  -- Check if in cooldown
  IF current_record.cooldown_until IS NOT NULL AND now_ts < current_record.cooldown_until THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'wait_seconds', EXTRACT(EPOCH FROM (current_record.cooldown_until - now_ts))::integer
    );
  END IF;
  
  -- Reset if enough time has passed
  IF now_ts - current_record.last_attempt > (reset_hours || ' hours')::interval THEN
    UPDATE public.email_rate_limits 
    SET attempt_count = 1, 
        last_attempt = now_ts,
        cooldown_until = NULL
    WHERE email_hash = check_email_rate_limit.email_hash;
    
    RETURN jsonb_build_object('allowed', true, 'attempts', 1);
  END IF;
  
  -- Check if limit exceeded
  IF current_record.attempt_count >= max_attempts THEN
    UPDATE public.email_rate_limits 
    SET cooldown_until = now_ts + (cooldown_minutes || ' minutes')::interval
    WHERE email_hash = check_email_rate_limit.email_hash;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'wait_seconds', cooldown_minutes * 60
    );
  END IF;
  
  -- Increment attempt count
  UPDATE public.email_rate_limits 
  SET attempt_count = attempt_count + 1,
      last_attempt = now_ts
  WHERE email_hash = check_email_rate_limit.email_hash;
  
  RETURN jsonb_build_object('allowed', true, 'attempts', current_record.attempt_count + 1);
END;
$$;

-- ============================================================================
-- 4. USER PROFILES
-- ============================================================================

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  company text,
  job_title text,
  is_admin boolean NOT NULL DEFAULT false,
  email_verified boolean NOT NULL DEFAULT false,
  last_sign_in_at timestamptz,
  sign_in_count integer NOT NULL DEFAULT 0 CHECK (sign_in_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Security constraints
  CONSTRAINT valid_email CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
  CONSTRAINT reasonable_name_length CHECK (length(full_name) <= 100),
  CONSTRAINT reasonable_company_length CHECK (length(company) <= 100),
  CONSTRAINT reasonable_title_length CHECK (length(job_title) <= 100)
);

-- Secure indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_id ON public.user_profiles(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(lower(email));
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON public.user_profiles(is_admin) WHERE is_admin = true;

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "users_can_view_own_profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all profiles (read-only)
CREATE POLICY "admins_can_view_all_profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- 5. USER MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to create user profile (called by app after Supabase auth)
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id uuid,
  user_email text,
  user_name text DEFAULT NULL
)
RETURNS public.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_email constant text := 'abushan.a@emuski.com';
  clean_email text;
  clean_name text;
  new_profile public.user_profiles;
BEGIN
  -- Validate inputs
  IF user_id IS NULL OR user_email IS NULL THEN
    RAISE EXCEPTION 'User ID and email are required';
  END IF;
  
  -- Only allow the authenticated user to create their own profile
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Cannot create profile for another user';
  END IF;
  
  -- Validate email domain
  IF NOT public.is_valid_company_email(user_email) THEN
    RAISE EXCEPTION 'Only company email addresses are allowed';
  END IF;
  
  -- Clean inputs
  clean_email := lower(trim(user_email));
  clean_name := trim(COALESCE(user_name, ''));
  
  -- Limit name length
  IF length(clean_name) > 100 THEN
    clean_name := left(clean_name, 100);
  END IF;
  
  -- Insert profile
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    is_admin,
    email_verified
  ) VALUES (
    user_id,
    clean_email,
    NULLIF(clean_name, ''),
    (clean_email = admin_email),
    false
  )
  RETURNING * INTO new_profile;
  
  RETURN new_profile;
END;
$$;

-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
  profile_updates jsonb
)
RETURNS public.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  updated_profile public.user_profiles;
  clean_name text;
  clean_company text;
  clean_title text;
BEGIN
  -- Validate user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Extract and validate fields
  clean_name := trim(COALESCE(profile_updates->>'full_name', ''));
  clean_company := trim(COALESCE(profile_updates->>'company', ''));
  clean_title := trim(COALESCE(profile_updates->>'job_title', ''));
  
  -- Length limits
  IF length(clean_name) > 100 THEN clean_name := left(clean_name, 100); END IF;
  IF length(clean_company) > 100 THEN clean_company := left(clean_company, 100); END IF;
  IF length(clean_title) > 100 THEN clean_title := left(clean_title, 100); END IF;
  
  -- Update profile
  UPDATE public.user_profiles SET
    full_name = NULLIF(clean_name, ''),
    company = NULLIF(clean_company, ''),
    job_title = NULLIF(clean_title, ''),
    updated_at = now()
  WHERE id = current_user_id
  RETURNING * INTO updated_profile;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;
  
  RETURN updated_profile;
END;
$$;

-- Function to update sign-in tracking
CREATE OR REPLACE FUNCTION public.update_sign_in_tracking()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  -- Validate user is authenticated
  IF current_user_id IS NULL THEN
    RETURN; -- Silently fail if not authenticated
  END IF;
  
  -- Update sign-in info
  UPDATE public.user_profiles SET
    last_sign_in_at = now(),
    sign_in_count = sign_in_count + 1,
    updated_at = now()
  WHERE id = current_user_id;
END;
$$;

-- ============================================================================
-- 6. UTILITY FUNCTIONS
-- ============================================================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_is_admin boolean := false;
BEGIN
  SELECT is_admin INTO user_is_admin
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_is_admin, false);
END;
$$;

-- Get current user profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS public.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_profile public.user_profiles;
BEGIN
  SELECT * INTO user_profile
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  RETURN user_profile;
END;
$$;

-- Validate email and check rate limit (for client-side use)
CREATE OR REPLACE FUNCTION public.validate_email_for_auth(input_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rate_result jsonb;
BEGIN
  -- Check email domain
  IF NOT public.is_valid_company_email(input_email) THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Only company email addresses are allowed. Personal emails (Gmail, Yahoo, etc.) are not permitted.'
    );
  END IF;
  
  -- Check rate limit
  rate_result := public.check_email_rate_limit(input_email);
  
  IF NOT (rate_result->>'allowed')::boolean THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', format('Too many attempts. Please wait %s seconds before trying again.', 
                     rate_result->>'wait_seconds')
    );
  END IF;
  
  RETURN jsonb_build_object('valid', true);
END;
$$;

-- ============================================================================
-- 7. CLEANUP FUNCTIONS
-- ============================================================================

-- Cleanup old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove records older than 7 days
  DELETE FROM public.email_rate_limits 
  WHERE created_at < now() - interval '7 days';
  
  -- Remove expired cooldowns older than 1 day
  DELETE FROM public.email_rate_limits 
  WHERE cooldown_until IS NOT NULL 
    AND cooldown_until < now() - interval '1 day';
END;
$$;

-- ============================================================================
-- 8. VIEWS FOR EASY ACCESS
-- ============================================================================

-- Current user view
CREATE OR REPLACE VIEW public.current_user AS
SELECT 
  id,
  email,
  full_name,
  company,
  job_title,
  is_admin,
  email_verified,
  last_sign_in_at,
  sign_in_count,
  created_at,
  updated_at
FROM public.user_profiles
WHERE id = auth.uid();

-- Grant access to authenticated users only
GRANT SELECT ON public.current_user TO authenticated;

-- ============================================================================
-- 9. SECURITY GRANTS
-- ============================================================================

-- Grant minimal necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Table permissions
GRANT SELECT, UPDATE ON public.user_profiles TO authenticated;

-- Function permissions
GRANT EXECUTE ON FUNCTION public.is_valid_company_email(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.validate_email_for_auth(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_profile(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_sign_in_tracking() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_profile() TO authenticated;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'EMUSKI Secure Authentication Setup Complete!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Features:';
  RAISE NOTICE '✅ Email domain validation (blocks personal emails)';
  RAISE NOTICE '✅ Rate limiting (3 attempts/hour, 15min cooldown)';
  RAISE NOTICE '✅ Secure user profiles with RLS';
  RAISE NOTICE '✅ Admin user support';
  RAISE NOTICE '✅ SQL injection protection';
  RAISE NOTICE '✅ Input validation and sanitization';
  RAISE NOTICE '';
  RAISE NOTICE 'Admin Email: abushan.a@emuski.com';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Update your client-side auth code to use these functions';
  RAISE NOTICE '============================================================================';
END $$;