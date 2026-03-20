-- Fix Supabase Storage Buckets
-- Run this in Supabase SQL Editor

-- Create the missing buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('cad-files', 'cad-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create the sub-folder structure by inserting a dummy file and then deleting it
-- This ensures the folders exist for future uploads

-- Enable storage on the bucket
UPDATE storage.buckets 
SET public = false, file_size_limit = 52428800, allowed_mime_types = ARRAY['application/octet-stream', 'model/step', 'model/x-step', 'application/sla']
WHERE id = 'cad-files';

-- Create storage policies for cad-files bucket
CREATE POLICY "Users can upload own CAD files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'cad-files' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = (auth.uid())::text
    );

CREATE POLICY "Users can view own CAD files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'cad-files' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = (auth.uid())::text
    );

CREATE POLICY "Users can update own CAD files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'cad-files' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = (auth.uid())::text
    );

CREATE POLICY "Users can delete own CAD files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'cad-files' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = (auth.uid())::text
    );

-- Verify buckets were created
SELECT * FROM storage.buckets WHERE id IN ('cad-files');