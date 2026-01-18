-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view comments on public/anonymous rants" ON public.rant_comments;

-- Create a more restrictive policy that requires authentication
CREATE POLICY "Authenticated users can view comments on public rants"
ON public.rant_comments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rants
    WHERE rants.id = rant_comments.rant_id
    AND rants.privacy IN ('public', 'anonymous')
  )
);

-- Also allow users to view comments on their own rants (private ones too)
CREATE POLICY "Users can view comments on their own rants"
ON public.rant_comments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rants
    WHERE rants.id = rant_comments.rant_id
    AND rants.user_id = auth.uid()
  )
);

-- Add comment explaining the security rationale
COMMENT ON POLICY "Authenticated users can view comments on public rants" ON public.rant_comments 
IS 'Restricts comment visibility to authenticated users only to prevent anonymous user_id harvesting';