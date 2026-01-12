-- Drop and recreate the SELECT policy with additional professional verification
DROP POLICY IF EXISTS "Users and professionals can view relevant bookings" ON public.bookings;

CREATE POLICY "Users and professionals can view relevant bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (
  -- Booking owner can always view their own bookings
  (auth.uid() = user_id) 
  OR 
  -- Professional can view ONLY if they are the assigned professional AND active
  (
    auth.uid() IN (
      SELECT p.user_id
      FROM professionals p
      WHERE p.id = bookings.professional_id
        AND p.is_active = true
        AND p.user_id IS NOT NULL
    )
  )
);