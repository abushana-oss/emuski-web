-- Core Row Level Security Policies for Security Fix
-- This migration focuses on essential RLS policies without storage modifications

-- 🔒 BALLOON PROJECTS - Enhanced User Ownership Policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_projects') THEN
        -- Enable RLS first
        ALTER TABLE balloon_projects ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can only access their own balloon projects" ON balloon_projects;
        DROP POLICY IF EXISTS "Users can only insert their own balloon projects" ON balloon_projects;
        
        -- Create comprehensive user ownership policy
        CREATE POLICY "Users can only access their own balloon projects" 
            ON balloon_projects FOR ALL
            USING (auth.uid() = user_id);

        CREATE POLICY "Users can only insert their own balloon projects" 
            ON balloon_projects FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 🔒 BALLOON ANNOTATIONS - Enhanced Project Ownership Validation
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_annotations') THEN
        -- Enable RLS first
        ALTER TABLE balloon_annotations ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can only access annotations from their own projects" ON balloon_annotations;
        DROP POLICY IF EXISTS "Users can only insert annotations to their own projects" ON balloon_annotations;
        
        -- Create policies that validate project ownership
        CREATE POLICY "Users can only access annotations from their own projects" 
            ON balloon_annotations FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM balloon_projects 
                    WHERE balloon_projects.id = balloon_annotations.project_id 
                    AND balloon_projects.user_id = auth.uid()
                )
            );

        CREATE POLICY "Users can only insert annotations to their own projects" 
            ON balloon_annotations FOR INSERT
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM balloon_projects 
                    WHERE balloon_projects.id = balloon_annotations.project_id 
                    AND balloon_projects.user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- 🔒 CREDIT SYSTEM - Enhanced User-Scoped Policies (only if tables exist)
DO $$
BEGIN
    -- Only create credit_usage policies if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_usage') THEN
        ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can only access their own credit usage" ON credit_usage;
        CREATE POLICY "Users can only access their own credit usage" 
            ON credit_usage FOR ALL
            USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can only insert their own credit usage" ON credit_usage;
        CREATE POLICY "Users can only insert their own credit usage" 
            ON credit_usage FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Only create user_credit_limits policies if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_credit_limits') THEN
        ALTER TABLE user_credit_limits ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can only access their own credit limits" ON user_credit_limits;
        CREATE POLICY "Users can only access their own credit limits" 
            ON user_credit_limits FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- 🔒 ADMIN ACCESS - Special policy for admin users
-- Create admin role check function (in public schema)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    ) OR (
        auth.jwt() ->> 'email' IN (
            SELECT unnest(string_to_array(
                coalesce(current_setting('app.admin_emails', true), 'abushan.a@emuski.com'),
                ','
            ))
        )
    );
$$;

-- Allow admin users to bypass RLS for support purposes (read-only)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_projects') THEN
        CREATE POLICY "Admin users can read all balloon projects" 
            ON balloon_projects FOR SELECT
            USING (public.is_admin_user());
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_annotations') THEN
        CREATE POLICY "Admin users can read all balloon annotations" 
            ON balloon_annotations FOR SELECT
            USING (public.is_admin_user());
    END IF;
END $$;

-- 📊 Create security audit view for monitoring (if base tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_projects') 
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_annotations') THEN
        
        CREATE OR REPLACE VIEW security_audit_log AS
        SELECT 
            'balloon_projects' as table_name,
            id as record_id,
            user_id,
            created_at,
            'project_access' as action_type
        FROM balloon_projects
        UNION ALL
        SELECT 
            'balloon_annotations' as table_name,
            ba.id as record_id,
            bp.user_id,
            ba.created_at,
            'annotation_access' as action_type
        FROM balloon_annotations ba
        JOIN balloon_projects bp ON ba.project_id = bp.id;
    END IF;
END $$;

-- 🛡️ Create function to validate API access patterns
CREATE OR REPLACE FUNCTION public.log_api_access(
    endpoint text,
    user_id uuid,
    resource_id uuid DEFAULT NULL,
    access_granted boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create table if it doesn't exist
    CREATE TABLE IF NOT EXISTS api_access_logs (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        endpoint text NOT NULL,
        user_id uuid NOT NULL,
        resource_id uuid,
        access_granted boolean NOT NULL DEFAULT true,
        timestamp timestamptz NOT NULL DEFAULT NOW()
    );
    
    INSERT INTO api_access_logs (endpoint, user_id, resource_id, access_granted, timestamp)
    VALUES (endpoint, user_id, resource_id, access_granted, NOW());
EXCEPTION WHEN OTHERS THEN
    -- Log errors but don't fail the request
    RAISE WARNING 'Failed to log API access: %', SQLERRM;
END;
$$;

COMMENT ON FUNCTION public.log_api_access IS 'Log API access for security monitoring and IDOR detection';