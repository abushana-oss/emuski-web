-- EMUSKI Fixed Production Database Schema
-- Simplified version that works with Supabase permissions

-- ============================================================================
-- 1. BASIC SETUP
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. USER PROFILES TABLE
-- ============================================================================

-- Drop existing table if it has issues
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create user profiles table with proper structure
CREATE TABLE public.user_profiles (
  -- Primary identification
  id uuid PRIMARY KEY,
  
  -- Basic information
  email text NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  phone text,
  
  -- Personal information
  first_name text,
  last_name text,
  full_name text,
  
  -- Professional information
  company_name text,
  job_title text,
  department text,
  
  -- Account management
  account_status text NOT NULL DEFAULT 'active' 
    CHECK (account_status IN ('active', 'suspended', 'inactive', 'pending')),
  is_admin boolean NOT NULL DEFAULT false,
  
  -- Security & tracking
  last_login_at timestamptz,
  login_count integer NOT NULL DEFAULT 0 CHECK (login_count >= 0),
  failed_login_attempts integer NOT NULL DEFAULT 0 CHECK (failed_login_attempts >= 0),
  locked_until timestamptz,
  
  -- Profile completion
  profile_completed boolean NOT NULL DEFAULT false,
  avatar_url text,
  
  -- Compliance
  terms_accepted_at timestamptz,
  privacy_policy_accepted_at timestamptz,
  marketing_emails_consent boolean NOT NULL DEFAULT false,
  
  -- Audit trail
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Data constraints for security
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT reasonable_name_length CHECK (
    (first_name IS NULL OR length(first_name) BETWEEN 1 AND 50) AND
    (last_name IS NULL OR length(last_name) BETWEEN 1 AND 50)
  ),
  CONSTRAINT reasonable_company_length CHECK (company_name IS NULL OR length(company_name) BETWEEN 1 AND 100),
  CONSTRAINT reasonable_job_title_length CHECK (job_title IS NULL OR length(job_title) BETWEEN 1 AND 100),
  CONSTRAINT valid_avatar_url CHECK (avatar_url IS NULL OR avatar_url ~ '^https?://')
);

-- Create indexes AFTER table is created
CREATE UNIQUE INDEX idx_user_profiles_id ON public.user_profiles(id);
CREATE UNIQUE INDEX idx_user_profiles_email ON public.user_profiles(lower(email));
CREATE INDEX idx_user_profiles_company ON public.user_profiles(company_name) WHERE company_name IS NOT NULL;
CREATE INDEX idx_user_profiles_status ON public.user_profiles(account_status);
CREATE INDEX idx_user_profiles_admin ON public.user_profiles(is_admin) WHERE is_admin = true;
CREATE INDEX idx_user_profiles_last_login ON public.user_profiles(last_login_at);

-- ============================================================================
-- 3. EMAIL DOMAINS TABLE
-- ============================================================================

-- Create email domains table
CREATE TABLE IF NOT EXISTS public.email_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  domain_type text NOT NULL CHECK (domain_type IN ('allowed', 'blocked', 'suspicious')),
  category text NOT NULL DEFAULT 'corporate' 
    CHECK (category IN ('corporate', 'personal', 'education', 'government', 'suspicious')),
  auto_approve boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_domain CHECK (domain ~ '^[a-z0-9.-]+\.[a-z]{2,}$')
);

-- Pre-populate blocked domains
INSERT INTO public.email_domains (domain, domain_type, category) VALUES
  ('gmail.com', 'blocked', 'personal'),
  ('yahoo.com', 'blocked', 'personal'),
  ('hotmail.com', 'blocked', 'personal'),
  ('outlook.com', 'blocked', 'personal'),
  ('live.com', 'blocked', 'personal'),
  ('aol.com', 'blocked', 'personal'),
  ('icloud.com', 'blocked', 'personal'),
  ('protonmail.com', 'blocked', 'personal')
ON CONFLICT (domain) DO NOTHING;

-- Allow EMUSKI domain
INSERT INTO public.email_domains (domain, domain_type, category, auto_approve) VALUES
  ('emuski.com', 'allowed', 'corporate', true)
ON CONFLICT (domain) DO NOTHING;

-- ============================================================================
-- 4. RATE LIMITING TABLE
-- ============================================================================

-- Rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier_hash text NOT NULL,
  limit_type text NOT NULL CHECK (limit_type IN ('email_signup', 'email_reset', 'login_attempt')),
  attempt_count integer NOT NULL DEFAULT 1 CHECK (attempt_count > 0),
  window_start timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_identifier_type UNIQUE(identifier_hash, limit_type),
  CONSTRAINT valid_identifier_hash CHECK (length(identifier_hash) = 64)
);

-- Index for rate limiting
CREATE INDEX idx_rate_limits_identifier_type ON public.rate_limits(identifier_hash, limit_type);

-- ============================================================================
-- 5. SECURITY EVENTS TABLE
-- ============================================================================

-- Security events logging
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email_hash text NOT NULL,
  event_type text NOT NULL 
    CHECK (event_type IN ('signup_attempt', 'login_attempt', 'password_reset_request')),
  ip_address inet,
  user_agent text,
  success boolean NOT NULL DEFAULT false,
  failure_reason text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_email_hash CHECK (length(email_hash) = 64)
);

-- Index for security events
CREATE INDEX idx_security_events_email_hash ON public.security_events(email_hash);
CREATE INDEX idx_security_events_type_time ON public.security_events(event_type, created_at);

-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "users_own_profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_read_profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true AND account_status = 'active'
    )
  );

-- Email domains policies
CREATE POLICY "users_read_domains" ON public.email_domains
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins_manage_domains" ON public.email_domains
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true AND account_status = 'active'
    )
  );

-- Rate limits and security events (system only)
CREATE POLICY "system_only_rate_limits" ON public.rate_limits FOR ALL USING (false);
CREATE POLICY "admins_read_security_events" ON public.security_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true AND account_status = 'active'
    )
  );

-- ============================================================================
-- 7. CORE FUNCTIONS
-- ============================================================================

-- Email domain validation function
CREATE OR REPLACE FUNCTION public.is_email_domain_allowed(input_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  domain_part text;
  domain_status text;
BEGIN
  -- Input validation
  IF input_email IS NULL OR length(trim(input_email)) = 0 THEN
    RETURN false;
  END IF;
  
  -- Extract domain
  domain_part := lower(split_part(trim(input_email), '@', 2));
  
  IF domain_part = '' THEN
    RETURN false;
  END IF;
  
  -- Check domain in database
  SELECT domain_type INTO domain_status
  FROM public.email_domains
  WHERE domain = domain_part;
  
  -- Blocked domains
  IF domain_status = 'blocked' THEN
    RETURN false;
  END IF;
  
  -- Allowed domains
  IF domain_status = 'allowed' THEN
    RETURN true;
  END IF;
  
  -- Unknown domains are allowed (corporate emails)
  RETURN true;
END;
$$;

-- Rate limiting function
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
BEGIN
  -- Create hash for privacy
  identifier_hash := encode(digest(lower(trim(identifier)), 'sha256'), 'hex');
  
  -- Check current rate limit
  SELECT attempt_count, rate_limits.window_start, rate_limits.blocked_until
  INTO current_count, window_start, blocked_until
  FROM public.rate_limits
  WHERE identifier_hash = check_rate_limit.identifier_hash 
    AND limit_type = check_rate_limit.limit_type;
  
  -- Check if blocked
  IF blocked_until IS NOT NULL AND blocked_until > now() THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'wait_seconds', EXTRACT(EPOCH FROM (blocked_until - now()))::integer,
      'attempts', current_count
    );
  END IF;
  
  -- If no record or window expired
  IF NOT FOUND OR window_start < now() - (window_minutes || ' minutes')::interval THEN
    INSERT INTO public.rate_limits (identifier_hash, limit_type, attempt_count, window_start)
    VALUES (identifier_hash, limit_type, 1, now())
    ON CONFLICT (identifier_hash, limit_type) 
    DO UPDATE SET 
      attempt_count = 1,
      window_start = now(),
      blocked_until = NULL,
      updated_at = now();
    
    RETURN jsonb_build_object('allowed', true, 'attempts', 1);
  END IF;
  
  -- Check if limit exceeded
  IF current_count >= max_attempts THEN
    UPDATE public.rate_limits
    SET blocked_until = now() + interval '15 minutes',
        updated_at = now()
    WHERE identifier_hash = check_rate_limit.identifier_hash 
      AND limit_type = check_rate_limit.limit_type;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'wait_seconds', 900,
      'attempts', current_count
    );
  END IF;
  
  -- Increment counter
  UPDATE public.rate_limits
  SET attempt_count = attempt_count + 1,
      updated_at = now()
  WHERE identifier_hash = check_rate_limit.identifier_hash 
    AND limit_type = check_rate_limit.limit_type;
  
  RETURN jsonb_build_object('allowed', true, 'attempts', current_count + 1);
END;
$$;

-- Security event logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_email text,
  p_event_type text,
  p_success boolean DEFAULT true,
  p_failure_reason text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_hash text;
  user_uuid uuid;
BEGIN
  -- Create email hash
  email_hash := encode(digest(lower(trim(p_email)), 'sha256'), 'hex');
  
  -- Try to get user ID
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = lower(trim(p_email));
  
  -- Insert security event
  INSERT INTO public.security_events (
    user_id,
    email_hash,
    event_type,
    ip_address,
    user_agent,
    success,
    failure_reason,
    metadata
  ) VALUES (
    user_uuid,
    email_hash,
    p_event_type,
    p_ip_address,
    p_user_agent,
    p_success,
    p_failure_reason,
    p_metadata
  );
END;
$$;

-- User profile management function
CREATE OR REPLACE FUNCTION public.upsert_user_profile(
  p_user_id uuid,
  p_email text,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_company_name text DEFAULT NULL,
  p_job_title text DEFAULT NULL
)
RETURNS public.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile public.user_profiles;
  admin_email constant text := 'abushan.a@emuski.com';
  computed_full_name text;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL OR p_email IS NULL THEN
    RAISE EXCEPTION 'User ID and email are required';
  END IF;
  
  -- Only allow users to manage their own profile
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Cannot modify another user''s profile';
  END IF;
  
  -- Compute full name
  IF p_first_name IS NOT NULL AND p_last_name IS NOT NULL THEN
    computed_full_name := trim(p_first_name || ' ' || p_last_name);
  ELSIF p_first_name IS NOT NULL THEN
    computed_full_name := p_first_name;
  ELSIF p_last_name IS NOT NULL THEN
    computed_full_name := p_last_name;
  ELSE
    computed_full_name := NULL;
  END IF;
  
  -- Upsert profile
  INSERT INTO public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    company_name,
    job_title,
    is_admin
  ) VALUES (
    p_user_id,
    lower(trim(p_email)),
    trim(p_first_name),
    trim(p_last_name),
    computed_full_name,
    trim(p_company_name),
    trim(p_job_title),
    (lower(trim(p_email)) = admin_email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    job_title = EXCLUDED.job_title,
    updated_at = now()
  RETURNING * INTO profile;
  
  RETURN profile;
END;
$$;

-- Login tracking function
CREATE OR REPLACE FUNCTION public.update_login_tracking()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    last_login_at = now(),
    login_count = login_count + 1,
    failed_login_attempts = 0,
    locked_until = NULL,
    updated_at = now()
  WHERE id = auth.uid();
END;
$$;

-- ============================================================================
-- 8. VIEWS
-- ============================================================================

-- Current user profile view
CREATE OR REPLACE VIEW public.current_user_profile AS
SELECT 
  id,
  email,
  email_verified,
  phone,
  first_name,
  last_name,
  full_name,
  company_name,
  job_title,
  department,
  account_status,
  is_admin,
  profile_completed,
  avatar_url,
  last_login_at,
  login_count,
  terms_accepted_at,
  privacy_policy_accepted_at,
  marketing_emails_consent,
  created_at,
  updated_at
FROM public.user_profiles
WHERE id = auth.uid();

-- ============================================================================
-- 9. TRIGGERS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_domains_updated_at
  BEFORE UPDATE ON public.email_domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 10. PERMISSIONS
-- ============================================================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.email_domains TO authenticated;
GRANT SELECT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.current_user_profile TO authenticated;

-- Function permissions
GRANT EXECUTE ON FUNCTION public.is_email_domain_allowed(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, text, boolean, text, inet, text, jsonb) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.upsert_user_profile(uuid, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_login_tracking() TO authenticated;

-- ============================================================================
-- COMPLETION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'EMUSKI Fixed Database Schema Setup Complete!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Features:';
  RAISE NOTICE '✅ User profiles with proper structure';
  RAISE NOTICE '✅ Email domain validation and management';
  RAISE NOTICE '✅ Rate limiting with privacy protection';
  RAISE NOTICE '✅ Security event logging';
  RAISE NOTICE '✅ Row Level Security (RLS)';
  RAISE NOTICE '✅ Industry-standard functions';
  RAISE NOTICE '✅ Proper indexes and constraints';
  RAISE NOTICE '';
  RAISE NOTICE 'Admin Email: abushan.a@emuski.com';
  RAISE NOTICE '============================================================================';
END $$;