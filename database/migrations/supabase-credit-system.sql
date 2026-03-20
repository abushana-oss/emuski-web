-- Credit Management System for Emuski CAD Analysis Platform
-- Run this script in your Supabase SQL editor

-- User credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining INTEGER NOT NULL DEFAULT 50,
  credits_limit INTEGER NOT NULL DEFAULT 50,
  last_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Credit usage log table for analytics and monitoring
CREATE TABLE IF NOT EXISTS credit_usage (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used INTEGER NOT NULL,
  cost_usd DECIMAL(10,6) NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('dfm_analysis', 'chat', 'upload')),
  file_name TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can insert their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can view their own usage" ON credit_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON credit_usage;

-- Policies for user_credits
CREATE POLICY "Users can view their own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits" ON user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for credit_usage
CREATE POLICY "Users can view their own usage" ON credit_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON credit_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_last_reset ON user_credits(last_reset);
CREATE INDEX IF NOT EXISTS idx_credit_usage_user_id ON credit_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created_at ON credit_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_usage_request_type ON credit_usage(request_type);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on user_credits
DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to reset user credits daily (call this from a scheduled job)
CREATE OR REPLACE FUNCTION reset_daily_credits()
RETURNS INTEGER AS $$
DECLARE
  reset_count INTEGER;
BEGIN
  UPDATE user_credits 
  SET 
    credits_remaining = credits_limit,
    last_reset = NOW(),
    updated_at = NOW()
  WHERE 
    last_reset < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  
  -- Log the reset operation
  INSERT INTO credit_usage (user_id, tokens_used, cost_usd, request_type, file_name)
  SELECT user_id, 0, 0.0, 'system', 'daily_credit_reset'
  FROM user_credits 
  WHERE last_reset >= NOW() - INTERVAL '5 minutes'; -- Recently reset users
  
  RETURN reset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for user credit status with time until next reset
CREATE OR REPLACE VIEW user_credit_status AS
SELECT 
  uc.user_id,
  uc.credits_remaining,
  uc.credits_limit,
  uc.last_reset,
  EXTRACT(EPOCH FROM (uc.last_reset + INTERVAL '24 hours' - NOW())) / 3600 AS hours_until_reset,
  CASE 
    WHEN uc.last_reset < NOW() - INTERVAL '24 hours' THEN true 
    ELSE false 
  END AS needs_reset,
  uc.created_at,
  uc.updated_at
FROM user_credits uc;

-- View for usage analytics
CREATE OR REPLACE VIEW user_usage_analytics AS
SELECT 
  cu.user_id,
  DATE(cu.created_at) as usage_date,
  cu.request_type,
  COUNT(*) as request_count,
  SUM(cu.tokens_used) as total_tokens,
  SUM(cu.cost_usd) as total_cost,
  AVG(cu.tokens_used) as avg_tokens_per_request,
  AVG(cu.processing_time_ms) as avg_processing_time
FROM credit_usage cu
WHERE cu.created_at >= NOW() - INTERVAL '30 days'
GROUP BY cu.user_id, DATE(cu.created_at), cu.request_type
ORDER BY usage_date DESC;

-- Insert default credits for existing users (if any)
INSERT INTO user_credits (user_id, credits_remaining, credits_limit, last_reset)
SELECT 
  id as user_id,
  50 as credits_remaining,
  50 as credits_limit,
  NOW() as last_reset
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_credits)
ON CONFLICT (user_id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_credits TO authenticated;
GRANT SELECT, INSERT ON credit_usage TO authenticated;
GRANT SELECT ON user_credit_status TO authenticated;
GRANT SELECT ON user_usage_analytics TO authenticated;

-- Success message
SELECT 'Credit management system installed successfully!' as status;