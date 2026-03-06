
-- Remove the current SELECT policy that gives professionals access to raw PII
DROP POLICY IF EXISTS "Users and professionals can view relevant bookings" ON public.bookings;

-- Recreate SELECT: only the booking owner can read from the base table
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Professionals access bookings through bookings_secure view (which masks PII)
-- No changes needed to bookings_secure view - it already masks name/email/notes
