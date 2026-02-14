
-- Step 1: Remove the policy that gives professionals direct access to full PII
DROP POLICY IF EXISTS "Users and professionals can view relevant bookings" ON public.bookings;

-- Step 2: Create owner-only SELECT policy on base table
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Step 3: Recreate bookings_secure view WITHOUT security_invoker
-- so the view itself handles access control and masks PII for professionals
DROP VIEW IF EXISTS public.bookings_secure;

CREATE VIEW public.bookings_secure AS
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
FROM public.bookings
WHERE
  -- Owner access
  auth.uid() = user_id
  OR
  -- Professional access (only active professionals assigned to the booking)
  auth.uid() IN (
    SELECT p.user_id FROM public.professionals p 
    WHERE p.id = bookings.professional_id 
    AND p.is_active = true 
    AND p.user_id IS NOT NULL
  );
