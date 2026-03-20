-- STEP 2: Run this second (RLS Policies)
-- Copy and paste this in Supabase SQL Editor AFTER running Step 1

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- CAD parts policies (Users can only access their own parts)
CREATE POLICY "Users can view own parts" ON public.cad_parts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own parts" ON public.cad_parts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own parts" ON public.cad_parts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own parts" ON public.cad_parts
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_cad_parts_user_id ON public.cad_parts(user_id);
CREATE INDEX IF NOT EXISTS idx_cad_parts_created_at ON public.cad_parts(created_at);

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, email_verified)
    VALUES (
        NEW.id, 
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cad_parts_updated_at 
    BEFORE UPDATE ON public.cad_parts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();