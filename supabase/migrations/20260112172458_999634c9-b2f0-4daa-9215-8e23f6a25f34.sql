-- Ensure emergency_contacts has proper RLS
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts FORCE ROW LEVEL SECURITY;

-- Drop and recreate all emergency_contacts policies with TO authenticated
DROP POLICY IF EXISTS "Users can view their own emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can create their own emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can update their own emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can delete their own emergency contacts" ON public.emergency_contacts;

CREATE POLICY "Users can view their own emergency contacts"
ON public.emergency_contacts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emergency contacts"
ON public.emergency_contacts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency contacts"
ON public.emergency_contacts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency contacts"
ON public.emergency_contacts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);