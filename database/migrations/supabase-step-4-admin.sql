-- STEP 4: Set Admin Status (Run after you've signed up)
-- Replace 'your-email@emuski.com' with your actual email

-- First check if your profile exists
SELECT * FROM public.user_profiles WHERE email = 'abushan.a@emuski.com';

-- If it exists, make yourself admin
UPDATE public.user_profiles 
SET is_admin = TRUE 
WHERE email = 'abushan.a@emuski.com';

-- Verify admin status
SELECT email, is_admin FROM public.user_profiles WHERE email = 'abushan.a@emuski.com';