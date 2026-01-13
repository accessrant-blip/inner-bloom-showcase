-- Create table for day plans
CREATE TABLE public.day_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  goals TEXT[] DEFAULT '{}',
  mood TEXT,
  energy_level INTEGER DEFAULT 3,
  easy_mode BOOLEAN DEFAULT false,
  schedule JSONB DEFAULT '[]',
  completed_tasks TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for mental gym progress
CREATE TABLE public.mental_gym_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  level INTEGER DEFAULT 1,
  completed_drills JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for social anxiety trainer progress
CREATE TABLE public.anxiety_trainer_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  confidence_score INTEGER DEFAULT 0,
  completed_missions JSONB DEFAULT '[]',
  current_level TEXT DEFAULT 'easy',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for inner child sessions
CREATE TABLE public.inner_child_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_gym_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anxiety_trainer_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inner_child_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for day_plans
CREATE POLICY "Users can view their own day plans" ON public.day_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own day plans" ON public.day_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own day plans" ON public.day_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own day plans" ON public.day_plans FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for mental_gym_progress
CREATE POLICY "Users can view their own gym progress" ON public.mental_gym_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own gym progress" ON public.mental_gym_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gym progress" ON public.mental_gym_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for anxiety_trainer_progress
CREATE POLICY "Users can view their own anxiety progress" ON public.anxiety_trainer_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own anxiety progress" ON public.anxiety_trainer_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own anxiety progress" ON public.anxiety_trainer_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for inner_child_sessions
CREATE POLICY "Users can view their own inner child sessions" ON public.inner_child_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own inner child sessions" ON public.inner_child_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_day_plans_updated_at BEFORE UPDATE ON public.day_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mental_gym_progress_updated_at BEFORE UPDATE ON public.mental_gym_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_anxiety_trainer_progress_updated_at BEFORE UPDATE ON public.anxiety_trainer_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();