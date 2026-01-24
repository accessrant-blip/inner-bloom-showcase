-- Fix the messages INSERT policy bug where it checks circle_id against itself
DROP POLICY IF EXISTS "Users can insert messages in their circles" ON public.messages;

CREATE POLICY "Users can insert messages in their circles"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM user_circles
    WHERE user_circles.user_id = auth.uid() 
    AND user_circles.circle_id = messages.circle_id
  )
);