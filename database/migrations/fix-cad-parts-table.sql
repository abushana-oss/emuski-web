-- Add user_email column to cad_parts table
ALTER TABLE public.cad_parts 
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Make it NOT NULL with a default value for existing rows
UPDATE public.cad_parts 
SET user_email = (
    SELECT email 
    FROM auth.users 
    WHERE auth.users.id = cad_parts.user_id
) 
WHERE user_email IS NULL;

-- Now make it NOT NULL
ALTER TABLE public.cad_parts 
ALTER COLUMN user_email SET NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_cad_parts_user_email ON public.cad_parts(user_email);