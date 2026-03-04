
CREATE TABLE public.cycle_mirror_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  insight_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  phase text,
  confidence_score numeric,
  suggested_actions jsonb DEFAULT '[]'::jsonb,
  pattern_data jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone
);

ALTER TABLE public.cycle_mirror_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cycle insights"
  ON public.cycle_mirror_insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cycle insights"
  ON public.cycle_mirror_insights FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycle insights"
  ON public.cycle_mirror_insights FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycle insights"
  ON public.cycle_mirror_insights FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
