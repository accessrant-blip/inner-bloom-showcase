-- Drop and recreate the SELECT policy with explicit authentication check
DROP POLICY IF EXISTS "Users and professionals can view relevant bookings" ON public.bookings;

CREATE POLICY "Users and professionals can view relevant bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id) OR 
  (auth.uid() IN (
    SELECT professionals.user_id
    FROM professionals
    WHERE professionals.id = bookings.professional_id
  ))
);