
CREATE TABLE public.cycle_behavior_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_day INTEGER NOT NULL,
  cycle_phase TEXT NOT NULL,
  behaviors TEXT[] NOT NULL DEFAULT '{}',
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cycle_behavior_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own behavior logs"
  ON public.cycle_behavior_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own behavior logs"
  ON public.cycle_behavior_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own behavior logs"
  ON public.cycle_behavior_logs FOR DELETE
  USING (auth.uid() = user_id);

CREATE UNIQUE INDEX cycle_behavior_logs_user_date ON public.cycle_behavior_logs (user_id, logged_at);
