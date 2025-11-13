-- Create feedback_form table
CREATE TABLE IF NOT EXISTS public.feedback_form (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  responsiveness TEXT NOT NULL,
  recommend TEXT NOT NULL,
  suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback_form ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own feedback"
  ON public.feedback_form
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON public.feedback_form
  FOR SELECT
  USING (auth.uid() = user_id);