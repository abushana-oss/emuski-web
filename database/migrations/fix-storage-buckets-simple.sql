-- Simple fix for Supabase Storage Buckets
-- Run this in Supabase SQL Editor

-- Create the missing bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'cad-files', 
    'cad-files', 
    false,
    52428800, -- 50MB limit
    ARRAY['application/octet-stream', 'model/step', 'model/x-step', 'application/sla', 'model/stl']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['application/octet-stream', 'model/step', 'model/x-step', 'application/sla', 'model/stl'];

-- Verify the bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'cad-files';