-- Simple fix for column name mismatch and add credits
-- Run this in Supabase SQL editor

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
  
  -- Reserve the credits
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

-- Check what columns exist in user_credits table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_credits' 
ORDER BY ordinal_position;

-- Check current credit status (using only existing columns)
SELECT *
FROM user_credits
WHERE user_id = auth.uid();

-- Add 10 test credits to current user
INSERT INTO user_credits (user_id, credits_remaining, credits_limit, last_reset, created_at, updated_at)
SELECT 
  auth.uid(),
  10.0,
  10.0,
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM user_credits WHERE user_id = auth.uid()
)
ON CONFLICT (user_id) DO UPDATE SET
  credits_remaining = GREATEST(user_credits.credits_remaining, 10.0),
  updated_at = NOW();

-- Verify the update
SELECT 
  user_id,
  credits_remaining,
  credits_limit,
  last_reset,
  'Credits updated successfully' as message
FROM user_credits
WHERE user_id = auth.uid();