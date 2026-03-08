
-- Fix: Allow professionals to view bookings assigned to them
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

CREATE POLICY "Users and professionals can view relevant bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  auth.uid() IN (
    SELECT user_id FROM public.professionals WHERE id = bookings.professional_id
  )
);
