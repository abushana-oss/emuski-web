-- Create function to check if user exists before signup
-- This prevents duplicate signups at the database level

CREATE OR REPLACE FUNCTION public.check_user_exists(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_exists boolean := false;
    user_verified boolean := false;
    result json;
BEGIN
    -- Check if user exists in auth.users table
    SELECT EXISTS(
        SELECT 1 
        FROM auth.users 
        WHERE email = lower(user_email)
    ) INTO user_exists;
    
    -- If user exists, check if they're verified
    IF user_exists THEN
        SELECT CASE 
            WHEN email_confirmed_at IS NOT NULL THEN true 
            ELSE false 
        END
        FROM auth.users 
        WHERE email = lower(user_email)
        INTO user_verified;
    END IF;
    
    -- Return structured result
    result := json_build_object(
        'user_exists', user_exists,
        'user_verified', user_verified
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_user_exists(text) TO authenticated;

-- Grant execute permission to anon users (for signup flow)
GRANT EXECUTE ON FUNCTION public.check_user_exists(text) TO anon;

DO $$
BEGIN
  RAISE NOTICE 'User existence check function created successfully!';
  RAISE NOTICE 'Function: check_user_exists(email)';
  RAISE NOTICE 'Returns: {"user_exists": boolean, "user_verified": boolean}';
END $$;