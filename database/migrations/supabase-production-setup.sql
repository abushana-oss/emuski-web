-- EMUSKI CAD Analysis Production Database Schema
-- Run these queries in your Supabase SQL Editor
-- Industry Standards: ANSI SQL, PostgreSQL best practices

-- ==========================================
-- 1. ENABLE ROW LEVEL SECURITY & EXTENSIONS
-- ==========================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: auth.users table RLS is managed by Supabase automatically
-- We cannot modify it directly due to security restrictions

-- ==========================================
-- 2. CREATE USER PROFILES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    
    PRIMARY KEY (id),
    UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- ==========================================
-- 3. CREATE CAD PARTS TABLE (MAIN TABLE)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.cad_parts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User Association (Authentication Required)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_email TEXT NOT NULL,
    
    -- Part Information
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('.stl', '.step', '.stp', '.iges', '.igs', '.obj')),
    file_size BIGINT,
    file_checksum TEXT, -- SHA-256 hash for integrity
    
    -- Geometry Data
    volume NUMERIC,
    dimensions JSONB, -- {width: number, height: number, depth: number}
    surface_area NUMERIC,
    complexity_score INTEGER CHECK (complexity_score >= 0 AND complexity_score <= 100),
    
    -- Manufacturing Data
    material TEXT,
    process TEXT,
    finish TEXT,
    tolerance TEXT DEFAULT 'ISO 2768-m (General)',
    threads TEXT DEFAULT 'No Threads Detected',
    inspection TEXT DEFAULT 'Standard QC (ASME Y14.5)',
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    
    -- Analysis Status
    analysis_status TEXT DEFAULT 'pending' CHECK (
        analysis_status IN ('pending', 'processing', 'completed', 'failed')
    ),
    
    -- Estimates
    manufacturability_score NUMERIC CHECK (manufacturability_score >= 0 AND manufacturability_score <= 100),
    estimated_cost NUMERIC CHECK (estimated_cost >= 0),
    lead_time_days INTEGER CHECK (lead_time_days >= 0),
    suggestions_count INTEGER DEFAULT 0,
    
    -- Metadata
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}', -- Additional file metadata
    
    -- Security & Compliance
    uploaded_from_ip INET,
    user_agent TEXT,
    classification TEXT DEFAULT 'INTERNAL' CHECK (
        classification IN ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED')
    )
);

-- Enable RLS
ALTER TABLE public.cad_parts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cad_parts (Users can only access their own parts)
CREATE POLICY "Users can view own parts" ON public.cad_parts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own parts" ON public.cad_parts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own parts" ON public.cad_parts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own parts" ON public.cad_parts
    FOR DELETE USING (auth.uid() = user_id);

-- Admin policy for cad_parts
CREATE POLICY "Admins can manage all parts" ON public.cad_parts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- ==========================================
-- 4. CREATE STORAGE BUCKETS & POLICIES
-- ==========================================

-- Note: Create storage buckets manually in Supabase Dashboard
-- Go to Storage → Create Bucket
-- Bucket 1: 'cad-files' (Private)
-- Bucket 2: 'thumbnails' (Public)

-- Storage policies for cad-files bucket (Private - User only)
-- Note: Run these AFTER creating the buckets in the Dashboard

-- Allow users to upload to their own folder
CREATE POLICY "Users can upload own CAD files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'cad-files' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to view their own files
CREATE POLICY "Users can view own CAD files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'cad-files' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to update their own files
CREATE POLICY "Users can update own CAD files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'cad-files' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own CAD files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'cad-files' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Thumbnail storage policies (Public bucket)
CREATE POLICY "Anyone can view thumbnails" ON storage.objects
    FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload thumbnails" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'thumbnails');

-- ==========================================
-- 5. CREATE SECURITY & AUDIT TABLES
-- ==========================================

-- Security events table for audit logging
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    event_type TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view security events
CREATE POLICY "Admins can view security events" ON public.security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier TEXT NOT NULL,
    limit_type TEXT NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(identifier, limit_type)
);

-- ==========================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ==========================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);

-- CAD parts indexes
CREATE INDEX IF NOT EXISTS idx_cad_parts_user_id ON public.cad_parts(user_id);
CREATE INDEX IF NOT EXISTS idx_cad_parts_created_at ON public.cad_parts(created_at);
CREATE INDEX IF NOT EXISTS idx_cad_parts_analysis_status ON public.cad_parts(analysis_status);
CREATE INDEX IF NOT EXISTS idx_cad_parts_file_type ON public.cad_parts(file_type);

-- Security events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON public.security_events(event_type);

-- Rate limits indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier, limit_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);

-- ==========================================
-- 7. CREATE FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for cad_parts
CREATE TRIGGER update_cad_parts_updated_at 
    BEFORE UPDATE ON public.cad_parts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, email_verified)
    VALUES (
        NEW.id, 
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 8. SECURITY FUNCTIONS
-- ==========================================

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_email TEXT,
    p_event_type TEXT,
    p_success BOOLEAN,
    p_failure_reason TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.security_events (
        user_id, email, event_type, success, failure_reason, 
        ip_address, user_agent, metadata
    ) VALUES (
        auth.uid(),
        p_email,
        p_event_type,
        p_success,
        p_failure_reason,
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent',
        p_metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    identifier TEXT,
    limit_type TEXT,
    max_attempts INTEGER DEFAULT 5,
    window_minutes INTEGER DEFAULT 60
)
RETURNS TABLE(allowed BOOLEAN, wait_seconds INTEGER) AS $$
DECLARE
    current_attempts INTEGER;
    window_start_time TIMESTAMP WITH TIME ZONE;
    blocked_until_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Clean old entries
    DELETE FROM public.rate_limits 
    WHERE window_start < NOW() - INTERVAL '1 hour';
    
    -- Get current rate limit record
    SELECT attempt_count, window_start, blocked_until 
    INTO current_attempts, window_start_time, blocked_until_time
    FROM public.rate_limits
    WHERE rate_limits.identifier = check_rate_limit.identifier 
    AND rate_limits.limit_type = check_rate_limit.limit_type;
    
    -- Check if currently blocked
    IF blocked_until_time IS NOT NULL AND blocked_until_time > NOW() THEN
        RETURN QUERY SELECT FALSE, EXTRACT(EPOCH FROM (blocked_until_time - NOW()))::INTEGER;
        RETURN;
    END IF;
    
    -- If no record or window expired, create/reset
    IF current_attempts IS NULL OR window_start_time < NOW() - (window_minutes || ' minutes')::INTERVAL THEN
        INSERT INTO public.rate_limits (identifier, limit_type, attempt_count)
        VALUES (check_rate_limit.identifier, check_rate_limit.limit_type, 1)
        ON CONFLICT (identifier, limit_type) 
        DO UPDATE SET 
            attempt_count = 1,
            window_start = NOW(),
            blocked_until = NULL;
        
        RETURN QUERY SELECT TRUE, 0;
        RETURN;
    END IF;
    
    -- Check if limit exceeded
    IF current_attempts >= max_attempts THEN
        -- Block for 15 minutes
        UPDATE public.rate_limits 
        SET blocked_until = NOW() + INTERVAL '15 minutes'
        WHERE rate_limits.identifier = check_rate_limit.identifier 
        AND rate_limits.limit_type = check_rate_limit.limit_type;
        
        RETURN QUERY SELECT FALSE, 900; -- 15 minutes
        RETURN;
    END IF;
    
    -- Increment attempt count
    UPDATE public.rate_limits 
    SET attempt_count = attempt_count + 1
    WHERE rate_limits.identifier = check_rate_limit.identifier 
    AND rate_limits.limit_type = check_rate_limit.limit_type;
    
    RETURN QUERY SELECT TRUE, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user exists
CREATE OR REPLACE FUNCTION public.check_user_exists(user_email TEXT)
RETURNS TABLE(user_exists BOOLEAN, user_verified BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM auth.users WHERE email = user_email) as user_exists,
        EXISTS(SELECT 1 FROM auth.users WHERE email = user_email AND email_confirmed_at IS NOT NULL) as user_verified;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 9. ADMIN SETUP
-- ==========================================

-- Update your admin status (replace with your email)
UPDATE public.user_profiles 
SET is_admin = TRUE 
WHERE email = 'abushan.a@emuski.com';

-- ==========================================
-- 10. FINAL GRANTS & PERMISSIONS
-- ==========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Ensure storage permissions
GRANT ALL ON SCHEMA storage TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated;