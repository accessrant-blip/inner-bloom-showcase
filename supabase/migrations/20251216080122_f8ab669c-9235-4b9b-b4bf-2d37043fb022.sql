-- Fix 1: Enable RLS on scheduled_sessions if not already enabled
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;

-- Fix 2: Drop the problematic policy on professionals that exposes user_id
DROP POLICY IF EXISTS "Professionals are viewable by everyone" ON public.professionals;

-- Create a new view-only policy that doesn't expose user_id mapping
-- Users can see active professionals but we'll handle user_id exclusion at query level
CREATE POLICY "Professionals public info viewable by everyone" 
ON public.professionals 
FOR SELECT 
USING (is_active = true);

-- Note: The user_id should not be selected in frontend queries for public views
-- The RLS can't hide specific columns, so the frontend must exclude user_id from SELECT