-- Create rant_comments table
CREATE TABLE public.rant_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rant_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rant_comments
CREATE POLICY "Anyone can view comments on public/anonymous rants"
ON public.rant_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rants
    WHERE rants.id = rant_comments.rant_id
    AND rants.privacy IN ('public', 'anonymous')
  )
);

CREATE POLICY "Users can create comments"
ON public.rant_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.rant_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Create rant_reports table
CREATE TABLE public.rant_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rant_id UUID NOT NULL,
  reporter_user_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rant_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy for rant_reports
CREATE POLICY "Users can report rants"
ON public.rant_reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_user_id);

-- Create indexes for performance
CREATE INDEX idx_rant_comments_rant_id ON public.rant_comments(rant_id);
CREATE INDEX idx_rant_reports_rant_id ON public.rant_reports(rant_id);