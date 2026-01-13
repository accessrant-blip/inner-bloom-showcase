-- Fix PUBLIC_DATA_EXPOSURE: Require authentication for profile access
-- Drop existing policies that allow anonymous access
DROP POLICY IF EXISTS "View circle member profiles" ON public.profiles;
DROP POLICY IF EXISTS "View professional profiles" ON public.profiles;
DROP POLICY IF EXISTS "View public rant author profiles" ON public.profiles;

-- Recreate policies with TO authenticated to require login

-- Policy: View profiles of circle members (requires authentication)
CREATE POLICY "View circle member profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_circles uc1
  JOIN user_circles uc2 ON uc1.circle_id = uc2.circle_id
  WHERE uc1.user_id = auth.uid() AND uc2.user_id = profiles.user_id
));

-- Policy: View professional profiles (requires authentication)
-- Professionals are public for the platform but require login to view
CREATE POLICY "View professional profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM professionals
  WHERE professionals.user_id = profiles.user_id
    AND professionals.is_active = true
));

-- Policy: View public rant author profiles (requires authentication)
CREATE POLICY "View public rant author profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM rants
  WHERE rants.user_id = profiles.user_id
    AND rants.privacy = 'public'
));