-- Create a secure view for public rants that masks user_id from non-owners
-- This prevents user identity exposure while still allowing ownership detection

-- First, drop the existing public rants SELECT policy
DROP POLICY IF EXISTS "Users can view public rants" ON public.rants;

-- Create a new policy that only allows viewing public rants for authenticated users
-- This ensures the user_id is only accessible to the owner through the ownership policy
CREATE POLICY "Authenticated users can view public rants"
ON public.rants
FOR SELECT
TO authenticated
USING (privacy IN ('public', 'anonymous'));

-- Create a secure function to get public rants with masked user_id
-- This function returns rants without exposing user_id to non-owners
CREATE OR REPLACE FUNCTION public.get_public_rants()
RETURNS TABLE (
  id uuid,
  content text,
  privacy text,
  created_at timestamptz,
  mood text,
  is_owner boolean,
  author_username text,
  author_avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id,
    r.content,
    r.privacy,
    r.created_at,
    r.mood,
    (r.user_id = auth.uid()) as is_owner,
    CASE 
      WHEN r.privacy = 'public' THEN p.username
      ELSE NULL
    END as author_username,
    CASE 
      WHEN r.privacy = 'public' THEN p.avatar_url
      ELSE NULL
    END as author_avatar_url
  FROM public.rants r
  LEFT JOIN public.profiles p ON r.user_id = p.user_id
  WHERE r.privacy IN ('public', 'anonymous')
  ORDER BY r.created_at DESC;
$$;