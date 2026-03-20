-- STEP 3: Storage Policies (Run AFTER creating buckets manually)
-- First: Go to Supabase Dashboard → Storage → Create Bucket
-- Create: 'cad-files' (Private)
-- Then run this SQL:

-- Storage policies for cad-files bucket
CREATE POLICY "Users can upload own CAD files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'cad-files' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own CAD files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'cad-files' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own CAD files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'cad-files' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );