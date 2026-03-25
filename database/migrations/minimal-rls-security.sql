-- Minimal Row Level Security Policies for Critical Security Fix
-- This migration only includes essential RLS policies for existing tables

-- 🔒 BALLOON PROJECTS - User Ownership Security
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_projects') THEN
        -- Enable RLS
        ALTER TABLE balloon_projects ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can only access their own balloon projects" ON balloon_projects;
        DROP POLICY IF EXISTS "Users can only insert their own balloon projects" ON balloon_projects;
        DROP POLICY IF EXISTS "balloon_projects_select_policy" ON balloon_projects;
        DROP POLICY IF EXISTS "balloon_projects_insert_policy" ON balloon_projects;
        
        -- Create user ownership policies
        CREATE POLICY "balloon_projects_user_access" 
            ON balloon_projects FOR ALL
            USING (auth.uid() = user_id);

        CREATE POLICY "balloon_projects_user_insert" 
            ON balloon_projects FOR INSERT
            WITH CHECK (auth.uid() = user_id);
        
        RAISE NOTICE 'RLS policies created for balloon_projects table';
    ELSE
        RAISE NOTICE 'balloon_projects table does not exist, skipping';
    END IF;
END $$;

-- 🔒 BALLOON ANNOTATIONS - Project Ownership Validation
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_annotations') 
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'balloon_projects') THEN
        
        -- Enable RLS
        ALTER TABLE balloon_annotations ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can only access annotations from their own projects" ON balloon_annotations;
        DROP POLICY IF EXISTS "Users can only insert annotations to their own projects" ON balloon_annotations;
        DROP POLICY IF EXISTS "balloon_annotations_select_policy" ON balloon_annotations;
        DROP POLICY IF EXISTS "balloon_annotations_insert_policy" ON balloon_annotations;
        
        -- Create project ownership policies
        CREATE POLICY "balloon_annotations_user_access" 
            ON balloon_annotations FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM balloon_projects 
                    WHERE balloon_projects.id = balloon_annotations.project_id 
                    AND balloon_projects.user_id = auth.uid()
                )
            );

        CREATE POLICY "balloon_annotations_user_insert" 
            ON balloon_annotations FOR INSERT
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM balloon_projects 
                    WHERE balloon_projects.id = balloon_annotations.project_id 
                    AND balloon_projects.user_id = auth.uid()
                )
            );
        
        RAISE NOTICE 'RLS policies created for balloon_annotations table';
    ELSE
        RAISE NOTICE 'balloon_annotations or balloon_projects table does not exist, skipping';
    END IF;
END $$;

-- 🔒 CREDIT USAGE - User-Scoped Policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_usage') THEN
        ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "credit_usage_user_access" ON credit_usage;
        DROP POLICY IF EXISTS "credit_usage_user_insert" ON credit_usage;
        
        CREATE POLICY "credit_usage_user_access" 
            ON credit_usage FOR ALL
            USING (auth.uid() = user_id);

        CREATE POLICY "credit_usage_user_insert" 
            ON credit_usage FOR INSERT
            WITH CHECK (auth.uid() = user_id);
        
        RAISE NOTICE 'RLS policies created for credit_usage table';
    ELSE
        RAISE NOTICE 'credit_usage table does not exist, skipping';
    END IF;
END $$;

-- ✅ Verification Query - Check which policies were created
DO $$
DECLARE
    policy_count integer;
BEGIN
    SELECT count(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND (tablename LIKE 'balloon_%' OR tablename = 'credit_usage');
    
    RAISE NOTICE 'Total RLS policies created: %', policy_count;
    
    -- List created policies
    FOR policy_count IN 
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND (tablename LIKE 'balloon_%' OR tablename = 'credit_usage')
    LOOP
        RAISE NOTICE 'Policy found: %.% (%)', 
            (SELECT tablename FROM pg_policies WHERE schemaname = 'public' AND (tablename LIKE 'balloon_%' OR tablename = 'credit_usage') LIMIT 1),
            (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND (tablename LIKE 'balloon_%' OR tablename = 'credit_usage') LIMIT 1),
            (SELECT cmd FROM pg_policies WHERE schemaname = 'public' AND (tablename LIKE 'balloon_%' OR tablename = 'credit_usage') LIMIT 1);
    END LOOP;
END $$;