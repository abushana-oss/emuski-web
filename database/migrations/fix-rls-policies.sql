-- Fix RLS policies for cad_parts table
-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Users can insert own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Users can update own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Users can delete own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Admins can manage all parts" ON public.cad_parts;

-- Create new, more permissive policies for development
-- Allow authenticated users to view their own parts
CREATE POLICY "Users can view own parts" ON public.cad_parts
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email)
    );

-- Allow authenticated users to insert parts
CREATE POLICY "Users can insert own parts" ON public.cad_parts
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email)
    );

-- Allow authenticated users to update their own parts
CREATE POLICY "Users can update own parts" ON public.cad_parts
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email)
    );

-- Allow authenticated users to delete their own parts
CREATE POLICY "Users can delete own parts" ON public.cad_parts
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email)
    );

-- Admin policy (if user_profiles table exists)
CREATE POLICY "Admins can manage all parts" ON public.cad_parts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Alternative: Temporarily disable RLS for development (uncomment if needed)
-- ALTER TABLE public.cad_parts DISABLE ROW LEVEL SECURITY;