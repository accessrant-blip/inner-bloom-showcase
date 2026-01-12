-- Ensure RLS is enabled and forced on private_info table
ALTER TABLE public.private_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_info FORCE ROW LEVEL SECURITY;

-- Drop and recreate all policies with explicit TO authenticated
DROP POLICY IF EXISTS "Users can view their own private info" ON public.private_info;
DROP POLICY IF EXISTS "Users can insert their own private info" ON public.private_info;
DROP POLICY IF EXISTS "Users can update their own private info" ON public.private_info;

CREATE POLICY "Users can view their own private info"
ON public.private_info FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own private info"
ON public.private_info FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own private info"
ON public.private_info FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);