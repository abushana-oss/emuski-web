-- Update credit system to support fractional credits (0.1, 0.2, etc)
-- Run this in Supabase SQL editor to enable cost-effective credit usage

-- Update the table structure to support decimal credits
ALTER TABLE user_credits 
ALTER COLUMN credits_remaining TYPE DECIMAL(10,1),
ALTER COLUMN credits_limit TYPE DECIMAL(10,1);

-- Update default values to use decimals
ALTER TABLE user_credits 
ALTER COLUMN credits_remaining SET DEFAULT 5.0,
ALTER COLUMN credits_limit SET DEFAULT 5.0;

-- Ensure existing users have decimal values
UPDATE user_credits 
SET 
  credits_remaining = CAST(credits_remaining AS DECIMAL(10,1)),
  credits_limit = CAST(credits_limit AS DECIMAL(10,1)),
  updated_at = NOW();

-- Verify the changes
SELECT 
  COUNT(*) as total_users,
  AVG(credits_remaining) as avg_credits_remaining,
  AVG(credits_limit) as avg_credits_limit,
  MIN(credits_remaining) as min_credits,
  MAX(credits_remaining) as max_credits
FROM user_credits;

SELECT 'Credit system updated to support fractional credits (0.1 precision)!' as status;

-- Example of how credits will now work:
-- "hi" message = ~250 tokens = 0.3 credits  
-- "what cost" = ~350 tokens = 0.4 credits
-- Complex analysis = ~800 tokens = 0.8 credits
-- Very detailed request = ~1200 tokens = 1.2 credits