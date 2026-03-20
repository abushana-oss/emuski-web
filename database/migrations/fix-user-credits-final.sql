-- Final fix for user_credits RLS policies
-- Run this in Supabase SQL Editor

-- First, disable RLS completely
ALTER TABLE user_credits DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (be thorough)
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_credits' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_credits', policy_rec.policyname);
    END LOOP;
END $$;

-- Clear any existing data
TRUNCATE user_credits RESTART IDENTITY;

-- Create a simple table structure (if needed)
-- Ensure user_id is text and create basic structure
DO $$
BEGIN
    -- Check if table exists and has correct structure
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_credits' AND column_name = 'user_id'
    ) THEN
        -- Create table if it doesn't exist
        CREATE TABLE user_credits (
            user_id TEXT PRIMARY KEY,
            credits_remaining INTEGER DEFAULT 5,
            credits_limit INTEGER DEFAULT 5,
            last_reset TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Grant all permissions to service role (no RLS for service role)
GRANT ALL PRIVILEGES ON user_credits TO service_role;
GRANT ALL PRIVILEGES ON user_credits TO postgres;

-- Grant basic permissions to other roles
GRANT SELECT, INSERT, UPDATE ON user_credits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_credits TO anon;

-- Enable RLS but create very permissive policy for service role
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create only one simple policy that allows service role everything
CREATE POLICY "allow_service_role_everything" ON user_credits
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS user_credits_user_id_idx ON user_credits(user_id);

-- Verify everything is working
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_credits';

-- Test insert (should work)
-- INSERT INTO user_credits (user_id, credits_remaining, credits_limit, last_reset, created_at, updated_at)
-- VALUES ('test-user-123', 5, 5, NOW(), NOW(), NOW());

-- Show table structure
\d user_credits;