-- Create journal table for detailed journal entries (separate from mood tracking)
CREATE TABLE IF NOT EXISTS public.journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_id UUID REFERENCES public.mood_journal(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  from_ai_chat BOOLEAN DEFAULT false
);

-- Enable RLS on journal
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;

-- Journal RLS policies
CREATE POLICY "Users can view their own journal entries"
  ON public.journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
  ON public.journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal FOR DELETE
  USING (auth.uid() = user_id);

-- Create ai_chat table for storing AI conversation history
CREATE TABLE IF NOT EXISTS public.ai_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ai_chat
ALTER TABLE public.ai_chat ENABLE ROW LEVEL SECURITY;

-- AI chat RLS policies
CREATE POLICY "Users can view their own AI chats"
  ON public.ai_chat FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI chats"
  ON public.ai_chat FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI chats"
  ON public.ai_chat FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI chats"
  ON public.ai_chat FOR DELETE
  USING (auth.uid() = user_id);

-- Create wellness_sessions table for tracking wellness tool usage
CREATE TABLE IF NOT EXISTS public.wellness_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool TEXT NOT NULL,
  duration INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wellness_sessions
ALTER TABLE public.wellness_sessions ENABLE ROW LEVEL SECURITY;

-- Wellness sessions RLS policies
CREATE POLICY "Users can view their own wellness sessions"
  ON public.wellness_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wellness sessions"
  ON public.wellness_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness sessions"
  ON public.wellness_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness sessions"
  ON public.wellness_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_journal_updated_at
  BEFORE UPDATE ON public.journal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_chat_updated_at
  BEFORE UPDATE ON public.ai_chat
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();