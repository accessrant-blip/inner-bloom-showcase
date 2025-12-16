-- Fix bookings RLS: Allow professionals to access their assigned bookings
-- This matches the pattern used in sessions, payments, and calls tables

-- Drop existing incomplete SELECT policy
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Create comprehensive SELECT policy for both clients and professionals
CREATE POLICY "Users and professionals can view relevant bookings"
ON public.bookings FOR SELECT
USING (
  -- Allow clients to view their bookings
  auth.uid() = user_id 
  OR
  -- Allow professionals to view bookings assigned to them
  auth.uid() IN (
    SELECT user_id FROM public.professionals WHERE id = bookings.professional_id
  )
);

-- Drop existing incomplete UPDATE policy
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

-- Create UPDATE policy for clients
CREATE POLICY "Clients can update their bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create UPDATE policy for professionals
CREATE POLICY "Professionals can update assigned bookings"
ON public.bookings FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.professionals WHERE id = bookings.professional_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.professionals WHERE id = bookings.professional_id
  )
);

-- Fix profiles RLS: Restrict profile visibility to appropriate contexts
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: View profiles of active professionals (needed for booking)
CREATE POLICY "View professional profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.user_id = profiles.user_id 
    AND professionals.is_active = true
  )
);

-- Policy 3: View profiles of users in same circles (for chat context)
CREATE POLICY "View circle member profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_circles uc1
    JOIN user_circles uc2 ON uc1.circle_id = uc2.circle_id
    WHERE uc1.user_id = auth.uid()
    AND uc2.user_id = profiles.user_id
  )
);

-- Policy 4: View profiles of public rant authors (for attribution)
CREATE POLICY "View public rant author profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM rants
    WHERE rants.user_id = profiles.user_id
    AND rants.privacy = 'public'
  )
);