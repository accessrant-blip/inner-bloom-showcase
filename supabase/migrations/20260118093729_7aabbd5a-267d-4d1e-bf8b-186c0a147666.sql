-- Create a secure view for bookings that masks sensitive data for professionals
-- Booking owners see all their data, professionals see masked email/name

CREATE OR REPLACE VIEW public.bookings_secure
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  professional_id,
  -- Only show name/email to the booking owner, mask for professionals
  CASE 
    WHEN auth.uid() = user_id THEN name
    ELSE 'Client'
  END as name,
  CASE 
    WHEN auth.uid() = user_id THEN email
    ELSE NULL
  END as email,
  booking_type,
  booking_date,
  booking_time,
  mode,
  -- Notes may contain sensitive info - only visible to owner
  CASE 
    WHEN auth.uid() = user_id THEN notes
    ELSE NULL
  END as notes,
  status,
  created_at,
  updated_at,
  duration,
  amount
FROM public.bookings;

-- Grant access to the view
GRANT SELECT ON public.bookings_secure TO authenticated;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.bookings_secure IS 'Secure view that masks client PII (email, name, notes) from professionals. Only booking owners can see their own sensitive data.';