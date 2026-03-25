-- Add test credits and fix SQL functions

-- First run the SQL fixes
\i fix-all-sql-ambiguity.sql

-- Add test credits (5.0 credits) to all users for testing
UPDATE user_credits 
SET credits_remaining = 5.0, 
    daily_credits = 5.0,
    updated_at = NOW()
WHERE user_id IN (
  SELECT auth.uid()
  UNION
  SELECT id FROM auth.users LIMIT 5
);

-- If no user_credits record exists, create one for current user
INSERT INTO user_credits (user_id, credits_remaining, daily_credits, last_reset_date, created_at, updated_at)
SELECT 
  auth.uid(),
  5.0,
  5.0, 
  CURRENT_DATE,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM user_credits WHERE user_id = auth.uid()
);

-- Show current credit status
SELECT 
  uc.user_id,
  uc.credits_remaining,
  uc.daily_credits,
  uc.last_reset_date,
  au.email
FROM user_credits uc
JOIN auth.users au ON uc.user_id = au.id
ORDER BY uc.updated_at DESC
LIMIT 5;