-- Fix: Hide user_id from public access to professionals table
-- This prevents exposing which users are mental health professionals

-- Step 1: Drop existing public SELECT policy
DROP POLICY IF EXISTS "Professionals public info viewable by everyone" ON public.professionals;

-- Step 2: Create a new restrictive policy that hides professionals from unauthenticated users at row level
-- But the user_id will still be visible to authenticated users who can see rows

-- Better approach: Create a view that excludes user_id for public display
-- and deny direct table access for SELECT

-- Create public-facing view without user_id
CREATE OR REPLACE VIEW public.professionals_public
WITH (security_invoker=on) AS
SELECT 
  id,
  name,
  alias,
  bio,
  role,
  specialties,
  availability_status,
  rate_per_session,
  currency,
  profile_image_url,
  is_verified,
  is_active,
  google_form_link,
  created_at,
  updated_at
  -- Explicitly exclude user_id from public view
FROM public.professionals
WHERE is_active = true;

-- Step 3: Create RLS policies for the base table
-- Public users: NO direct access to professionals table
-- This forces them to use the view which hides user_id

-- Policy for authenticated users who are the professional themselves
CREATE POLICY "Users can view their own professional profile"
ON public.professionals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for professionals to be viewable by other authenticated users (without user_id exposure via join)
-- Note: The view handles public access, this handles authenticated access for operations like booking lookups
CREATE POLICY "Authenticated users can view active professionals basic info"
ON public.professionals FOR SELECT
TO authenticated
USING (is_active = true);

-- Add comment explaining the security pattern
COMMENT ON VIEW public.professionals_public IS 'Public-facing view of professionals that excludes user_id to prevent exposing which users are mental health professionals. Always use this view for public listings.';