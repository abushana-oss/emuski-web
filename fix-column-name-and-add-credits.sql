-- Fix column name mismatch and add test credits
-- Run this in Supabase SQL editor

-- First, recreate the functions with correct column name
\i fix-all-sql-ambiguity.sql

-- Check current credit status
SELECT 
  user_id,
  credits_remaining,
  daily_credits,
  last_reset_date,
  created_at,
  updated_at
FROM user_credits
WHERE user_id = auth.uid();

-- Add 10 test credits if the user has insufficient credits
INSERT INTO user_credits (user_id, credits_remaining, daily_credits, last_reset_date, created_at, updated_at)
SELECT 
  auth.uid(),
  10.0,
  10.0,
  CURRENT_DATE,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM user_credits WHERE user_id = auth.uid()
)
ON CONFLICT (user_id) DO UPDATE SET
  credits_remaining = GREATEST(user_credits.credits_remaining, 10.0),
  daily_credits = GREATEST(user_credits.daily_credits, 10.0),
  updated_at = NOW();

-- Verify the update
SELECT 
  user_id,
  credits_remaining,
  daily_credits,
  last_reset_date,
  'Credits updated successfully' as message
FROM user_credits
WHERE user_id = auth.uid();