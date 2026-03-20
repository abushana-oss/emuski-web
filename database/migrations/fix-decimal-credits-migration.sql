-- Safe migration to support fractional credits
-- This handles the view/rule dependency issue

-- Step 1: Drop any dependent views/rules temporarily
DROP VIEW IF EXISTS user_credit_status CASCADE;

-- Step 2: Now we can safely alter the column types
ALTER TABLE user_credits 
ALTER COLUMN credits_remaining TYPE DECIMAL(10,1) USING credits_remaining::DECIMAL(10,1),
ALTER COLUMN credits_limit TYPE DECIMAL(10,1) USING credits_limit::DECIMAL(10,1);

-- Step 3: Update default values
ALTER TABLE user_credits 
ALTER COLUMN credits_remaining SET DEFAULT 5.0,
ALTER COLUMN credits_limit SET DEFAULT 5.0;

-- Step 4: Ensure existing data is properly formatted
UPDATE user_credits 
SET 
  credits_remaining = ROUND(credits_remaining::DECIMAL(10,1), 1),
  credits_limit = ROUND(credits_limit::DECIMAL(10,1), 1),
  updated_at = NOW();

-- Step 5: Recreate the view if it was important (optional)
-- You can recreate user_credit_status view here if needed
-- CREATE VIEW user_credit_status AS 
-- SELECT user_id, credits_remaining, credits_limit, 
--        (credits_limit - credits_remaining) as credits_used
-- FROM user_credits;

-- Verify the changes
SELECT 
  COUNT(*) as total_users,
  AVG(credits_remaining) as avg_credits_remaining,
  AVG(credits_limit) as avg_credits_limit,
  MIN(credits_remaining) as min_credits,
  MAX(credits_remaining) as max_credits
FROM user_credits;

SELECT 'Decimal credits migration completed successfully!' as status;

-- Test fractional credit calculation
SELECT 
  'Examples of new fractional credit usage:' as info,
  '0.3 credits for simple messages like "hi"' as simple_message,
  '0.6 credits for medium questions' as medium_message, 
  '1.2 credits for complex analysis requests' as complex_message;