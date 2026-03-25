-- Create atomic credit reservation system to prevent race conditions
-- This migration adds database functions for secure, atomic credit operations

-- Create credit reservations table
CREATE TABLE IF NOT EXISTS credit_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  credits_reserved DECIMAL(4,1) NOT NULL,
  request_type TEXT NOT NULL,
  file_name TEXT,
  estimated_tokens INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'released')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  actual_credits_used DECIMAL(4,1),
  actual_tokens_used INTEGER,
  cost_usd DECIMAL(10,4)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_reservations_user_id ON credit_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_reservations_status ON credit_reservations(status);
CREATE INDEX IF NOT EXISTS idx_credit_reservations_created_at ON credit_reservations(created_at);

-- Enable RLS
ALTER TABLE credit_reservations ENABLE ROW LEVEL SECURITY;

-- RLS policies for credit_reservations
CREATE POLICY "Users can view own reservations" ON credit_reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all reservations" ON credit_reservations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to atomically reserve credits
CREATE OR REPLACE FUNCTION reserve_credits(
  p_user_id UUID,
  p_credits_needed DECIMAL(4,1),
  p_request_type TEXT,
  p_file_name TEXT DEFAULT NULL,
  p_estimated_tokens INTEGER DEFAULT 0
)
RETURNS TABLE(
  success BOOLEAN,
  reservation_id UUID,
  credits_remaining DECIMAL(4,1),
  hours_until_reset DECIMAL(10,2),
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_credits RECORD;
  v_reservation_id UUID;
  v_next_reset TIMESTAMPTZ;
  v_hours_until_reset DECIMAL(10,2);
BEGIN
  -- Lock the user's credit record to prevent race conditions
  SELECT * INTO v_user_credits
  FROM user_credits 
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- If user doesn't exist, create with default credits
  IF v_user_credits IS NULL THEN
    INSERT INTO user_credits (user_id, credits_remaining, credits_limit, last_reset)
    VALUES (p_user_id, 5, 5, NOW())
    RETURNING * INTO v_user_credits;
  END IF;
  
  -- Check if daily reset is needed
  IF DATE(v_user_credits.last_reset) < DATE(NOW()) THEN
    UPDATE user_credits 
    SET credits_remaining = credits_limit,
        last_reset = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO v_user_credits;
  END IF;
  
  -- Calculate next reset time
  v_next_reset := DATE_TRUNC('day', NOW() + INTERVAL '1 day');
  v_hours_until_reset := EXTRACT(EPOCH FROM (v_next_reset - NOW())) / 3600;
  
  -- Check if user has sufficient credits
  IF v_user_credits.credits_remaining < p_credits_needed THEN
    RETURN QUERY SELECT 
      FALSE as success,
      NULL::UUID as reservation_id,
      v_user_credits.credits_remaining,
      v_hours_until_reset,
      'Insufficient credits' as error_message;
    RETURN;
  END IF;
  
  -- Create reservation
  INSERT INTO credit_reservations (
    user_id, credits_reserved, request_type, file_name, estimated_tokens
  )
  VALUES (
    p_user_id, p_credits_needed, p_request_type, p_file_name, p_estimated_tokens
  )
  RETURNING id INTO v_reservation_id;
  
  -- Reserve the credits (temporarily reduce available credits)
  UPDATE user_credits 
  SET credits_remaining = credits_remaining - p_credits_needed,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT 
    TRUE as success,
    v_reservation_id,
    (v_user_credits.credits_remaining - p_credits_needed) as credits_remaining,
    v_hours_until_reset,
    NULL::TEXT as error_message;
END;
$$;

-- Function to confirm credit usage after successful operation
CREATE OR REPLACE FUNCTION confirm_credit_usage(
  p_reservation_id UUID,
  p_actual_credits_used DECIMAL(4,1),
  p_actual_tokens_used INTEGER,
  p_cost_usd DECIMAL(10,4)
)
RETURNS TABLE(
  user_id UUID,
  credits_remaining DECIMAL(4,1),
  credits_limit DECIMAL(4,1),
  last_reset TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reservation RECORD;
  v_credit_difference DECIMAL(4,1);
BEGIN
  -- Get reservation details
  SELECT * INTO v_reservation
  FROM credit_reservations
  WHERE id = p_reservation_id AND status = 'reserved'
  FOR UPDATE;
  
  IF v_reservation IS NULL THEN
    RAISE EXCEPTION 'Reservation not found or already processed';
  END IF;
  
  -- Calculate difference between reserved and actual credits used
  v_credit_difference := v_reservation.credits_reserved - p_actual_credits_used;
  
  -- Update reservation as confirmed
  UPDATE credit_reservations
  SET status = 'confirmed',
      confirmed_at = NOW(),
      actual_credits_used = p_actual_credits_used,
      actual_tokens_used = p_actual_tokens_used,
      cost_usd = p_cost_usd
  WHERE id = p_reservation_id;
  
  -- If actual usage is less than reserved, credit back the difference
  IF v_credit_difference > 0 THEN
    UPDATE user_credits
    SET credits_remaining = credits_remaining + v_credit_difference,
        updated_at = NOW()
    WHERE user_id = v_reservation.user_id;
  END IF;
  
  -- Log the credit usage
  INSERT INTO credit_usage (user_id, tokens_used, cost_usd, request_type, file_name)
  VALUES (v_reservation.user_id, p_actual_tokens_used, p_cost_usd, v_reservation.request_type, v_reservation.file_name);
  
  -- Return updated user credits
  RETURN QUERY 
  SELECT uc.user_id, uc.credits_remaining, uc.credits_limit, uc.last_reset, uc.created_at, uc.updated_at
  FROM user_credits uc
  WHERE uc.user_id = v_reservation.user_id;
END;
$$;

-- Function to release reserved credits if operation fails
CREATE OR REPLACE FUNCTION release_credit_reservation(
  p_reservation_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reservation RECORD;
BEGIN
  -- Get reservation details
  SELECT * INTO v_reservation
  FROM credit_reservations
  WHERE id = p_reservation_id AND status = 'reserved'
  FOR UPDATE;
  
  IF v_reservation IS NULL THEN
    RETURN; -- Already processed or doesn't exist
  END IF;
  
  -- Mark reservation as released
  UPDATE credit_reservations
  SET status = 'released'
  WHERE id = p_reservation_id;
  
  -- Return the reserved credits to the user
  UPDATE user_credits
  SET credits_remaining = credits_remaining + v_reservation.credits_reserved,
      updated_at = NOW()
  WHERE user_id = v_reservation.user_id;
END;
$$;

-- Grant permissions to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON credit_reservations TO service_role;
GRANT EXECUTE ON FUNCTION reserve_credits TO service_role;
GRANT EXECUTE ON FUNCTION confirm_credit_usage TO service_role;
GRANT EXECUTE ON FUNCTION release_credit_reservation TO service_role;

-- Clean up old reservations (run as maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_credit_reservations()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Release reservations older than 1 hour that are still in 'reserved' status
  UPDATE credit_reservations
  SET status = 'released'
  WHERE status = 'reserved' 
    AND created_at < NOW() - INTERVAL '1 hour';
    
  -- Return credits for released reservations
  UPDATE user_credits
  SET credits_remaining = credits_remaining + (
    SELECT COALESCE(SUM(credits_reserved), 0)
    FROM credit_reservations cr
    WHERE cr.user_id = user_credits.user_id 
      AND cr.status = 'released'
      AND cr.created_at > NOW() - INTERVAL '1 hour'
  ),
  updated_at = NOW()
  WHERE EXISTS (
    SELECT 1 FROM credit_reservations cr
    WHERE cr.user_id = user_credits.user_id 
      AND cr.status = 'released'
      AND cr.created_at > NOW() - INTERVAL '1 hour'
  );
  
  -- Delete old processed reservations (older than 7 days)
  DELETE FROM credit_reservations
  WHERE status IN ('confirmed', 'released') 
    AND created_at < NOW() - INTERVAL '7 days';
END;
$$;