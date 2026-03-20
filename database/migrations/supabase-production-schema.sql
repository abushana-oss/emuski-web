-- EMUSKI Production Database Schema
-- Industry Standards & Best Practices Implementation
-- Compatible with Supabase Auth System

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================================================
-- 2. USER PROFILES TABLE (Industry Standard)
-- ============================================================================

-- User profiles extending Supabase auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
  -- Primary identification
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic information
  email text NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  phone text,
  phone_verified boolean NOT NULL DEFAULT false,
  
  -- Personal information
  first_name text,
  last_name text,
  full_name text GENERATED ALWAYS AS (
    CASE 
      WHEN first_name IS NOT NULL AND last_name IS NOT NULL 
      THEN trim(first_name || ' ' || last_name)
      WHEN first_name IS NOT NULL THEN first_name
      WHEN last_name IS NOT NULL THEN last_name
      ELSE NULL
    END
  ) STORED,
  
  -- Professional information
  company_name text,
  job_title text,
  department text,
  
  -- Account management
  account_status text NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'inactive', 'pending')),
  is_admin boolean NOT NULL DEFAULT false,
  
  -- Security & tracking
  last_login_at timestamptz,
  login_count integer NOT NULL DEFAULT 0 CHECK (login_count >= 0),
  failed_login_attempts integer NOT NULL DEFAULT 0 CHECK (failed_login_attempts >= 0),
  locked_until timestamptz,
  
  -- Profile completion
  profile_completed boolean NOT NULL DEFAULT false,
  avatar_url text,
  
  -- Compliance & GDPR
  terms_accepted_at timestamptz,
  privacy_policy_accepted_at timestamptz,
  marketing_emails_consent boolean NOT NULL DEFAULT false,
  
  -- Audit trail
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  
  -- Data constraints for security
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT reasonable_name_length CHECK (
    (first_name IS NULL OR length(first_name) BETWEEN 1 AND 50) AND
    (last_name IS NULL OR length(last_name) BETWEEN 1 AND 50)
  ),
  CONSTRAINT reasonable_company_length CHECK (company_name IS NULL OR length(company_name) BETWEEN 1 AND 100),
  CONSTRAINT reasonable_job_title_length CHECK (job_title IS NULL OR length(job_title) BETWEEN 1 AND 100),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\+?[\d\s\-\(\)]{10,20}$'),
  CONSTRAINT valid_avatar_url CHECK (avatar_url IS NULL OR avatar_url ~ '^https?://'),
  CONSTRAINT valid_lock_period CHECK (locked_until IS NULL OR locked_until > now())
);

-- Indexes for performance and security
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(lower(email));
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company_name) WHERE company_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON public.user_profiles(is_admin) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON public.user_profiles(last_login_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_locked ON public.user_profiles(locked_until) WHERE locked_until IS NOT NULL;

-- ============================================================================
-- 3. SECURITY & RATE LIMITING TABLES
-- ============================================================================

-- Email domain validation and management
CREATE TABLE IF NOT EXISTS public.email_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  domain_type text NOT NULL CHECK (domain_type IN ('allowed', 'blocked', 'suspicious')),
  category text NOT NULL DEFAULT 'corporate' CHECK (category IN ('corporate', 'personal', 'education', 'government', 'suspicious')),
  auto_approve boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_domain CHECK (domain ~ '^[a-z0-9.-]+\.[a-z]{2,}$')
);

-- Pre-populate blocked personal domains
INSERT INTO public.email_domains (domain, domain_type, category) VALUES
  ('gmail.com', 'blocked', 'personal'),
  ('yahoo.com', 'blocked', 'personal'),
  ('hotmail.com', 'blocked', 'personal'),
  ('outlook.com', 'blocked', 'personal'),
  ('live.com', 'blocked', 'personal'),
  ('aol.com', 'blocked', 'personal'),
  ('icloud.com', 'blocked', 'personal'),
  ('protonmail.com', 'blocked', 'personal'),
  ('mail.com', 'blocked', 'personal'),
  ('zoho.com', 'blocked', 'personal'),
  ('yandex.com', 'blocked', 'personal')
ON CONFLICT (domain) DO NOTHING;

-- Allow EMUSKI domain
INSERT INTO public.email_domains (domain, domain_type, category, auto_approve) VALUES
  ('emuski.com', 'allowed', 'corporate', true)
ON CONFLICT (domain) DO NOTHING;

-- Rate limiting for security operations
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email_hash text NOT NULL, -- SHA-256 hash for privacy
  event_type text NOT NULL CHECK (event_type IN ('signup_attempt', 'login_attempt', 'password_reset_request', 'email_verification_request')),
  ip_address inet,
  user_agent text,
  success boolean NOT NULL DEFAULT false,
  failure_reason text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_email_hash CHECK (length(email_hash) = 64) -- SHA-256 length
);

-- Indexes for security events
CREATE INDEX IF NOT EXISTS idx_security_events_email_hash ON public.security_events(email_hash);
CREATE INDEX IF NOT EXISTS idx_security_events_type_time ON public.security_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON public.security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);

-- Rate limiting tracking
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier_hash text NOT NULL, -- Can be email hash, IP hash, etc.
  limit_type text NOT NULL CHECK (limit_type IN ('email_signup', 'email_reset', 'login_attempt', 'ip_signup')),
  attempt_count integer NOT NULL DEFAULT 1 CHECK (attempt_count > 0),
  window_start timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_identifier_type UNIQUE(identifier_hash, limit_type),
  CONSTRAINT valid_identifier_hash CHECK (length(identifier_hash) = 64),
  CONSTRAINT valid_block_period CHECK (blocked_until IS NULL OR blocked_until > window_start)
);

-- Index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_type ON public.rate_limits(identifier_hash, limit_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked ON public.rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- ============================================================================
-- 4. BUSINESS LOGIC TABLES
-- ============================================================================

-- User sessions for better tracking (supplement to Supabase auth)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  is_active boolean NOT NULL DEFAULT true,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_session_token CHECK (length(session_token) >= 32),
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Indexes for session management
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active, last_activity_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preference_key text NOT NULL,
  preference_value jsonb,
  is_encrypted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_preference UNIQUE(user_id, preference_key),
  CONSTRAINT valid_preference_key CHECK (preference_key ~ '^[a-z0-9_]+$' AND length(preference_key) BETWEEN 1 AND 50)
);

-- Index for preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "users_own_profile_full_access" ON public.user_profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_read_all_profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true AND account_status = 'active'
    )
  );

-- Email Domains Policies (read-only for users, admin manage)
CREATE POLICY "users_read_email_domains" ON public.email_domains
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins_manage_email_domains" ON public.email_domains
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true AND account_status = 'active'
    )
  );

-- Security Events Policies (admin only)
CREATE POLICY "admins_read_security_events" ON public.security_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND is_admin = true AND account_status = 'active'
    )
  );

-- Rate Limits Policies (system functions only)
CREATE POLICY "system_only_rate_limits" ON public.rate_limits
  FOR ALL USING (false); -- Only system functions can access

-- User Sessions Policies
CREATE POLICY "users_own_sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Preferences Policies
CREATE POLICY "users_own_preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. SECURITY FUNCTIONS
-- ============================================================================

-- Function to validate email domain
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
  
  -- Check domain in our database
  SELECT domain_type INTO domain_status
  FROM public.email_domains
  WHERE domain = domain_part;
  
  -- If domain is explicitly blocked
  IF domain_status = 'blocked' THEN
    RETURN false;
  END IF;
  
  -- If domain is explicitly allowed
  IF domain_status = 'allowed' THEN
    RETURN true;
  END IF;
  
  -- For unknown domains, allow by default (corporate emails)
  -- But we could change this to false for stricter control
  RETURN true;
END;
$$;

-- Function to check rate limits
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
  result jsonb;
BEGIN
  -- Create hash for privacy
  identifier_hash := encode(digest(lower(trim(identifier)), 'sha256'), 'hex');
  
  -- Check current rate limit
  SELECT attempt_count, rate_limits.window_start, rate_limits.blocked_until
  INTO current_count, window_start, blocked_until
  FROM public.rate_limits
  WHERE identifier_hash = check_rate_limit.identifier_hash 
    AND limit_type = check_rate_limit.limit_type;
  
  -- Check if currently blocked
  IF blocked_until IS NOT NULL AND blocked_until > now() THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'wait_seconds', EXTRACT(EPOCH FROM (blocked_until - now()))::integer,
      'attempts', current_count
    );
  END IF;
  
  -- If no record or window expired, start fresh
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
    -- Block for 15 minutes
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
  
  -- Increment counter
  UPDATE public.rate_limits
  SET attempt_count = attempt_count + 1,
      updated_at = now()
  WHERE identifier_hash = check_rate_limit.identifier_hash 
    AND limit_type = check_rate_limit.limit_type;
  
  RETURN jsonb_build_object('allowed', true, 'attempts', current_count + 1);
END;
$$;

-- Function to log security events
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
  -- Create email hash for privacy
  email_hash := encode(digest(lower(trim(p_email)), 'sha256'), 'hex');
  
  -- Try to get user ID if exists
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

-- ============================================================================
-- 7. USER MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to create/update user profile
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
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL OR p_email IS NULL THEN
    RAISE EXCEPTION 'User ID and email are required';
  END IF;
  
  -- Only allow users to create/update their own profile
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Cannot modify another user''s profile';
  END IF;
  
  -- Validate email domain
  IF NOT public.is_email_domain_allowed(p_email) THEN
    RAISE EXCEPTION 'Email domain not allowed';
  END IF;
  
  -- Upsert profile
  INSERT INTO public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    company_name,
    job_title,
    is_admin,
    created_by,
    updated_by
  ) VALUES (
    p_user_id,
    lower(trim(p_email)),
    trim(p_first_name),
    trim(p_last_name),
    trim(p_company_name),
    trim(p_job_title),
    (lower(trim(p_email)) = admin_email),
    p_user_id,
    p_user_id
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    company_name = EXCLUDED.company_name,
    job_title = EXCLUDED.job_title,
    updated_at = now(),
    updated_by = p_user_id
  RETURNING * INTO profile;
  
  RETURN profile;
END;
$$;

-- Function to update login tracking
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
    failed_login_attempts = 0, -- Reset on successful login
    locked_until = NULL, -- Clear any lock
    updated_at = now(),
    updated_by = auth.uid()
  WHERE id = auth.uid();
END;
$$;

-- ============================================================================
-- 8. TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply update triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_domains_updated_at
  BEFORE UPDATE ON public.email_domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 9. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Current user profile view
CREATE OR REPLACE VIEW public.current_user_profile AS
SELECT 
  id,
  email,
  email_verified,
  phone,
  phone_verified,
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

-- Admin dashboard view
CREATE OR REPLACE VIEW public.admin_user_summary AS
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
  COUNT(*) FILTER (WHERE account_status = 'active') as active_users,
  COUNT(*) FILTER (WHERE is_admin = true) as admin_users,
  COUNT(*) FILTER (WHERE last_login_at > now() - interval '30 days') as recent_logins,
  COUNT(*) FILTER (WHERE created_at > now() - interval '7 days') as new_users_week
FROM public.user_profiles;

-- ============================================================================
-- 10. MAINTENANCE AND CLEANUP
-- ============================================================================

-- Function to clean up old records
CREATE OR REPLACE FUNCTION public.cleanup_old_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clean up old security events (keep 90 days)
  DELETE FROM public.security_events 
  WHERE created_at < now() - interval '90 days';
  
  -- Clean up expired rate limits
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - interval '24 hours'
    AND (blocked_until IS NULL OR blocked_until < now());
  
  -- Clean up expired sessions
  DELETE FROM public.user_sessions
  WHERE expires_at < now() OR last_activity_at < now() - interval '30 days';
  
  -- Vacuum tables for performance
  -- Note: VACUUM cannot be run inside a function, would need to be scheduled separately
END;
$$;

-- ============================================================================
-- 11. GRANTS AND PERMISSIONS
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;

-- Table permissions
GRANT SELECT ON public.email_domains TO authenticated;
GRANT SELECT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT ON public.user_sessions TO authenticated;
GRANT ALL ON public.user_preferences TO authenticated;

-- Function permissions
GRANT EXECUTE ON FUNCTION public.is_email_domain_allowed(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.upsert_user_profile(uuid, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_login_tracking() TO authenticated;

-- View permissions
GRANT SELECT ON public.current_user_profile TO authenticated;

-- Admin-only permissions
-- Note: These would be granted specifically to admin users through additional policies

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'EMUSKI Production Database Schema Complete!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Industry Standards Implemented:';
  RAISE NOTICE '✅ Comprehensive user profile management';
  RAISE NOTICE '✅ Email domain validation with database control';
  RAISE NOTICE '✅ Advanced rate limiting and security tracking';
  RAISE NOTICE '✅ Row Level Security (RLS) on all tables';
  RAISE NOTICE '✅ Audit trails and compliance features';
  RAISE NOTICE '✅ Session management and user preferences';
  RAISE NOTICE '✅ Automated triggers and maintenance functions';
  RAISE NOTICE '✅ Admin dashboard and monitoring views';
  RAISE NOTICE '✅ GDPR compliance fields';
  RAISE NOTICE '✅ Security event logging';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Update your application to use these new functions';
  RAISE NOTICE '2. Set up automated cleanup job for maintenance';
  RAISE NOTICE '3. Configure monitoring and alerting';
  RAISE NOTICE '4. Review and customize admin policies as needed';
  RAISE NOTICE '';
  RAISE NOTICE 'Admin Email: abushan.a@emuski.com';
  RAISE NOTICE '============================================================================';
END $$;