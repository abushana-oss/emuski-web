-- Increase storage bucket file size limits for CAD files
-- Update bucket policies to allow larger files (500MB)

-- Update cad-files bucket to allow larger uploads
UPDATE storage.buckets 
SET file_size_limit = 524288000  -- 500MB in bytes
WHERE id = 'cad-files';

-- Create cad-files bucket if it doesn't exist with proper settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cad-files',
  'CAD Files Storage',
  false,  -- private bucket for security
  524288000,  -- 500MB limit
  ARRAY[
    'application/octet-stream',
    'application/step',
    'application/sla',
    'model/step',
    'model/stl',
    'model/iges',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY[
    'application/octet-stream',
    'application/step', 
    'application/sla',
    'model/step',
    'model/stl',
    'model/iges',
    'application/pdf'
  ];

-- Ensure proper RLS policies for cad-files bucket
-- Drop existing policies first (if they exist) then recreate
DROP POLICY IF EXISTS "Authenticated users can upload CAD files" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their own CAD files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own CAD files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own CAD files" ON storage.objects;

-- Create new policies for cad-files bucket
CREATE POLICY "Authenticated users can upload CAD files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cad-files');

CREATE POLICY "Users can access their own CAD files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cad-files');

CREATE POLICY "Users can update their own CAD files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cad-files');

CREATE POLICY "Users can delete their own CAD files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cad-files');