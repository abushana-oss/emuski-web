-- Complete fix for column name mismatch and credit system
-- Run this entire script in Supabase SQL editor

-- Fix reserve_credits function with correct column name
CREATE OR REPLACE FUNCTION reserve_credits(
  p_user_id UUID,
  p_credits_needed DECIMAL(10,1),
  p_request_type TEXT,
  p_file_name TEXT DEFAULT NULL,
  p_estimated_tokens INTEGER DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  reservation_id UUID,
  remaining_credits DECIMAL(10,1),
  message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_current_credits DECIMAL(10,1);
  v_reservation_id UUID;
BEGIN
  -- Check current credits
  SELECT user_credits.credits_remaining INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id;

  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL(10,1), 'User not found';
    RETURN;
  END IF;

  IF v_current_credits < p_credits_needed THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, v_current_credits, 'Insufficient credits';
    RETURN;
  END IF;

  -- Create reservation record with correct column name
  INSERT INTO credit_reservations (
    user_id, credits_reserved, status, request_type, file_name, estimated_tokens
  ) VALUES (
    p_user_id, p_credits_needed, 'reserved', p_request_type, p_file_name, p_estimated_tokens
  )
  RETURNING id INTO v_reservation_id;
  
  -- Reserve the credits (temporarily reduce available credits)
  UPDATE user_credits 
  SET credits_remaining = user_credits.credits_remaining - p_credits_needed,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT 
    TRUE as success,
    v_reservation_id,
    (v_current_credits - p_credits_needed) as remaining_credits,
    'Credits reserved successfully' as message;
END;
$$;

-- Fix confirm_credit_usage function
CREATE OR REPLACE FUNCTION confirm_credit_usage(
  p_reservation_id UUID,
  p_actual_credits_used DECIMAL(10,1),
  p_actual_tokens_used INTEGER DEFAULT NULL,
  p_cost_usd DECIMAL(10,4) DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_reservation RECORD;
  v_credit_difference DECIMAL(10,1);
BEGIN
  -- Get reservation details
  SELECT * INTO v_reservation
  FROM credit_reservations
  WHERE id = p_reservation_id AND status = 'reserved';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found or already processed';
  END IF;

  -- Calculate difference between reserved and actual usage
  v_credit_difference := v_reservation.credits_reserved - p_actual_credits_used;

  -- Update reservation status
  UPDATE credit_reservations
  SET status = 'confirmed',
      actual_credits_used = p_actual_credits_used,
      actual_tokens_used = p_actual_tokens_used,
      cost_usd = p_cost_usd
  WHERE id = p_reservation_id;
  
  -- If actual usage is less than reserved, credit back the difference
  IF v_credit_difference > 0 THEN
    UPDATE user_credits
    SET credits_remaining = user_credits.credits_remaining + v_credit_difference,
        updated_at = NOW()
    WHERE user_id = v_reservation.user_id;
  END IF;
  
  -- Log the credit usage
  INSERT INTO credit_usage (user_id, tokens_used, cost_usd, request_type, file_name)
  VALUES (v_reservation.user_id, p_actual_tokens_used, p_cost_usd, v_reservation.request_type, v_reservation.file_name)
  ON CONFLICT DO NOTHING;
END;
$$;

-- Fix release_credit_reservation function
CREATE OR REPLACE FUNCTION release_credit_reservation(p_reservation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_reservation RECORD;
BEGIN
  -- Get reservation details
  SELECT * INTO v_reservation
  FROM credit_reservations
  WHERE id = p_reservation_id AND status = 'reserved';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found or already processed';
  END IF;

  -- Mark reservation as released
  UPDATE credit_reservations
  SET status = 'released'
  WHERE id = p_reservation_id;
  
  -- Return the reserved credits to the user
  UPDATE user_credits
  SET credits_remaining = user_credits.credits_remaining + v_reservation.credits_reserved,
      updated_at = NOW()
  WHERE user_id = v_reservation.user_id;
END;
$$;

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