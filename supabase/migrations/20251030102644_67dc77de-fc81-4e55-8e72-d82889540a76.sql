-- Create circles (chat rooms) table
CREATE TABLE public.circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  sender_alias TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_circles table (tracks which circles users have joined)
CREATE TABLE public.user_circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, circle_id)
);

-- Create message_reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

-- Create message_reports table
CREATE TABLE public.message_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  reporter_user_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for circles
CREATE POLICY "Circles are viewable by everyone"
ON public.circles FOR SELECT
USING (true);

-- RLS Policies for messages
CREATE POLICY "Messages are viewable by circle members"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_circles
    WHERE user_circles.user_id = auth.uid()
    AND user_circles.circle_id = messages.circle_id
  )
);

CREATE POLICY "Users can insert messages in their circles"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.user_circles
    WHERE user_circles.user_id = auth.uid()
    AND user_circles.circle_id = circle_id
  )
);

CREATE POLICY "Users can delete their own messages"
ON public.messages FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for user_circles
CREATE POLICY "Users can view their own circle memberships"
ON public.user_circles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can join circles"
ON public.user_circles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave circles"
ON public.user_circles FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for message_reactions
CREATE POLICY "Reactions are viewable by circle members"
ON public.message_reactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.messages
    JOIN public.user_circles ON user_circles.circle_id = messages.circle_id
    WHERE messages.id = message_reactions.message_id
    AND user_circles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add reactions"
ON public.message_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their reactions"
ON public.message_reactions FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for message_reports
CREATE POLICY "Users can report messages"
ON public.message_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_circles_updated_at
BEFORE UPDATE ON public.circles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default circles
INSERT INTO public.circles (name, description, icon, member_count) VALUES
('Circle Lounge', 'A welcoming space for open conversations and support.', '💬', 0),
('Rant Room', 'Let it all out. A safe space to vent and release.', '😤', 0),
('Healing Space', 'Share your healing journey and find comfort.', '🌸', 0),
('Laugh Zone', 'Lighten up with humor, memes, and joy.', '😄', 0),
('Anxiety Support', 'A safe space to discuss anxiety and coping mechanisms.', '🫂', 0),
('Mindfulness & Meditation', 'Share practices and experiences with mindfulness.', '🧘', 0);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_circles;