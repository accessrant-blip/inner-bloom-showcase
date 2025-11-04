-- Create emotion_suggestions table to track user emotions and suggestions
CREATE TABLE IF NOT EXISTS public.emotion_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  emotion TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emotion_suggestions ENABLE ROW LEVEL SECURITY;

-- Users can view their own emotion history
CREATE POLICY "Users can view their own emotion suggestions"
  ON public.emotion_suggestions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own emotion suggestions
CREATE POLICY "Users can insert their own emotion suggestions"
  ON public.emotion_suggestions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_emotion_suggestions_user_id 
  ON public.emotion_suggestions(user_id);

CREATE INDEX IF NOT EXISTS idx_emotion_suggestions_created_at 
  ON public.emotion_suggestions(created_at DESC);