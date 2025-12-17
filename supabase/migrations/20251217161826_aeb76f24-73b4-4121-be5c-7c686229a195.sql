-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own scheduled sessions" ON public.scheduled_sessions;
DROP POLICY IF EXISTS "Users can insert their own scheduled sessions" ON public.scheduled_sessions;
DROP POLICY IF EXISTS "Users can update their own scheduled sessions" ON public.scheduled_sessions;
DROP POLICY IF EXISTS "Users can delete their own scheduled sessions" ON public.scheduled_sessions;

-- Recreate policies with explicit NULL protection
CREATE POLICY "Users can view their own scheduled sessions"
ON public.scheduled_sessions
FOR SELECT
TO authenticated
USING (user_id IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled sessions"
ON public.scheduled_sessions
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled sessions"
ON public.scheduled_sessions
FOR UPDATE
TO authenticated
USING (user_id IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (user_id IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled sessions"
ON public.scheduled_sessions
FOR DELETE
TO authenticated
USING (user_id IS NOT NULL AND auth.uid() = user_id);