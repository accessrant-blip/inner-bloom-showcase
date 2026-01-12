-- Ensure RLS is enabled on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (prevents bypassing)
ALTER TABLE public.bookings FORCE ROW LEVEL SECURITY;

-- Drop and recreate all policies with explicit TO authenticated
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can update their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Professionals can update assigned bookings" ON public.bookings;

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients can update their bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Professionals can update assigned bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() IN (
  SELECT professionals.user_id
  FROM professionals
  WHERE professionals.id = bookings.professional_id
))
WITH CHECK (auth.uid() IN (
  SELECT professionals.user_id
  FROM professionals
  WHERE professionals.id = bookings.professional_id
));