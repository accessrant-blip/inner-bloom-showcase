-- Make the avatars bucket private for enhanced privacy in mental health app
UPDATE storage.buckets 
SET public = false 
WHERE id = 'avatars';

-- Add policy for authenticated users to view avatars
CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);