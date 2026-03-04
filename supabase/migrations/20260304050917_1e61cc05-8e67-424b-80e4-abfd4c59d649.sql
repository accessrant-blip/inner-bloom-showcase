
CREATE TABLE public.user_cycle_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  last_period_date date NOT NULL,
  cycle_length integer NOT NULL DEFAULT 28,
  behavior_tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_cycle_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cycle data" ON public.user_cycle_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cycle data" ON public.user_cycle_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cycle data" ON public.user_cycle_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cycle data" ON public.user_cycle_data FOR DELETE USING (auth.uid() = user_id);
