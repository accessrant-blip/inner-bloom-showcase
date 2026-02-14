
-- Step 1: Drop the SECURITY DEFINER view
DROP VIEW IF EXISTS public.bookings_secure;

-- Step 2: Add professional SELECT access to the base bookings table
-- (currently only owner can SELECT)
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

CREATE POLICY "Users and professionals can view relevant bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT p.user_id FROM public.professionals p
    WHERE p.id = bookings.professional_id
    AND p.is_active = true
    AND p.user_id IS NOT NULL
  )
);

-- Step 3: Recreate the view with SECURITY INVOKER (default) and PII masking
-- RLS on bookings table now controls access; the view just masks fields
CREATE VIEW public.bookings_secure
WITH (security_invoker = on)
AS
SELECT
  id,
  user_id,
  professional_id,
  booking_date,
  booking_time,
  booking_type,
  mode,
  duration,
  amount,
  status,
  created_at,
  updated_at,
  -- Only show PII to the booking owner, mask for professionals
  CASE WHEN auth.uid() = user_id THEN name ELSE '***' END AS name,
  CASE WHEN auth.uid() = user_id THEN email ELSE '***' END AS email,
  CASE WHEN auth.uid() = user_id THEN notes ELSE NULL END AS notes
FROM public.bookings;
