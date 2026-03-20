-- Update existing credit system to use 5 credits instead of 50
-- Run this in Supabase SQL editor after the initial setup

-- Update existing user credit limits and remaining credits to 5
UPDATE user_credits 
SET 
  credits_remaining = 5,
  credits_limit = 5,
  last_reset = NOW(),
  updated_at = NOW()
WHERE credits_limit = 50 OR credits_remaining > 5;

-- Update the default values in the table structure
ALTER TABLE user_credits 
ALTER COLUMN credits_remaining SET DEFAULT 5,
ALTER COLUMN credits_limit SET DEFAULT 5;

-- Insert default credits for any new users (if they don't already have credits)
INSERT INTO user_credits (user_id, credits_remaining, credits_limit, last_reset)
SELECT 
  id as user_id,
  5 as credits_remaining,
  5 as credits_limit,
  NOW() as last_reset
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_credits)
ON CONFLICT (user_id) DO NOTHING;

-- Verify the changes
SELECT 
  COUNT(*) as total_users,
  AVG(credits_remaining) as avg_credits_remaining,
  AVG(credits_limit) as avg_credits_limit
FROM user_credits;

SELECT 'Credit system updated to 5 credits per user successfully!' as status;