-- Add explicit policy to deny INSERT for authenticated users
-- Service role bypasses RLS and can still insert
CREATE POLICY "Only service role can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (false);