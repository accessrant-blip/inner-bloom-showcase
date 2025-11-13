-- Create table for logging Calendly scheduled sessions
CREATE TABLE IF NOT EXISTS public.scheduled_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  session_type TEXT NOT NULL,
  calendly_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own scheduled sessions
CREATE POLICY "Users can view their own scheduled sessions"
ON public.scheduled_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own scheduled sessions
CREATE POLICY "Users can insert their own scheduled sessions"
ON public.scheduled_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);