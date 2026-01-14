-- Create table for user game progress
CREATE TABLE public.user_game_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  game_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress JSONB NOT NULL DEFAULT '{"currentLevel": 0, "completedWords": {}, "unlockedFeatures": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_game_progress_user_id_key UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.user_game_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own game progress"
ON public.user_game_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game progress"
ON public.user_game_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game progress"
ON public.user_game_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_game_progress_updated_at
BEFORE UPDATE ON public.user_game_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();