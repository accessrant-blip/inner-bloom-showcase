-- Drop existing policies on scheduled_sessions
DROP POLICY IF EXISTS "Users can insert their own scheduled sessions" ON public.scheduled_sessions;
DROP POLICY IF EXISTS "Users can view their own scheduled sessions" ON public.scheduled_sessions;

-- Ensure RLS is enabled
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;

-- Create proper PERMISSIVE policies (not restrictive)
CREATE POLICY "Users can view their own scheduled sessions"
ON public.scheduled_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled sessions"
ON public.scheduled_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled sessions"
ON public.scheduled_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled sessions"
ON public.scheduled_sessions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);