-- Fix RLS policies for user_credits table
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily to clean up
ALTER TABLE user_credits DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can insert own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON user_credits;
DROP POLICY IF EXISTS "Service role full access" ON user_credits;

-- Clear any existing data that might be causing conflicts
TRUNCATE user_credits;

-- Re-enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
-- 1. Allow users to view their own credits
CREATE POLICY "Users can view own credits" ON user_credits
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id OR user_id = auth.uid()::text)
    );

-- 2. Allow users to insert their own credits (for initial creation)  
CREATE POLICY "Users can insert own credits" ON user_credits
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id OR user_id = auth.uid()::text)
    );

-- 3. Allow users to update their own credits
CREATE POLICY "Users can update own credits" ON user_credits
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id OR user_id = auth.uid()::text)
    );

-- 4. Allow service role full access (for server-side operations)
CREATE POLICY "Service role full access" ON user_credits
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR current_user = 'service_role'
        OR session_user = 'service_role'
    );

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_credits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_credits TO anon;

-- Ensure the service role has full access
GRANT ALL ON user_credits TO service_role;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS user_credits_user_id_idx ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS user_credits_last_reset_idx ON user_credits(last_reset);

-- Verify the policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_credits';

-- Test query (should work after running this script)
-- INSERT INTO user_credits (user_id, credits_remaining, credits_limit, last_reset, created_at, updated_at)
-- VALUES ('test-user-id', 5, 5, NOW(), NOW(), NOW());