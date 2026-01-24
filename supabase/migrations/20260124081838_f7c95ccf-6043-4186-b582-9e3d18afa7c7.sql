-- Drop the buggy policy and recreate with correct reference
DROP POLICY IF EXISTS "Users can insert messages in their circles" ON public.messages;

CREATE POLICY "Users can insert messages in their circles"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM user_circles uc
    WHERE uc.user_id = auth.uid() 
    AND uc.circle_id = messages.circle_id
  )
);