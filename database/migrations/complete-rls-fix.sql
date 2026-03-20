-- Complete RLS fix for cad_parts table
-- This will allow authenticated users to work with parts

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'cad_parts';

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Users can insert own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Users can update own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Users can delete own parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Admins can manage all parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Authenticated users can insert parts" ON public.cad_parts;
DROP POLICY IF EXISTS "Authenticated users can view parts" ON public.cad_parts;

-- Create simple, permissive policies for development
CREATE POLICY "Allow authenticated select" ON public.cad_parts
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated insert" ON public.cad_parts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update" ON public.cad_parts
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated delete" ON public.cad_parts
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Alternative: Temporarily disable RLS completely (uncomment if needed)
-- ALTER TABLE public.cad_parts DISABLE ROW LEVEL SECURITY;