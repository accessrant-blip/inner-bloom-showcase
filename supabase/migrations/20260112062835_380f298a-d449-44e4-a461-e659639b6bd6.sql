-- Add new columns to circles table for enhanced functionality
ALTER TABLE public.circles 
ADD COLUMN IF NOT EXISTS topic text,
ADD COLUMN IF NOT EXISTS capacity integer DEFAULT 20,
ADD COLUMN IF NOT EXISTS next_session_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_circles_topic ON public.circles(topic);
CREATE INDEX IF NOT EXISTS idx_circles_next_session ON public.circles(next_session_at);

-- Insert seed data for realistic conversational groups
INSERT INTO public.circles (name, description, icon, topic, capacity, next_session_at, member_count)
VALUES 
  ('Anxiety Support', 'A safe space to share experiences and coping strategies for anxiety.', '💭', 'Anxiety', 15, NOW() + INTERVAL '2 hours', 0),
  ('Depression Warriors', 'Connect with others who understand the journey through depression.', '🌱', 'Depression', 12, NOW() + INTERVAL '1 day', 0),
  ('Stress Relief Zone', 'Share tips and techniques for managing daily stress.', '🧘', 'Stress', 20, NOW() + INTERVAL '3 hours', 0),
  ('Grief & Loss', 'A compassionate community for those processing grief.', '🕊️', 'Grief', 10, NOW() + INTERVAL '4 hours', 0),
  ('Self-Care Circle', 'Discover and share self-care practices that work.', '💆', 'Self-Care', 25, NOW() + INTERVAL '6 hours', 0),
  ('Mindfulness Practice', 'Learn and practice mindfulness together.', '🧠', 'Mindfulness', 18, NOW() + INTERVAL '30 minutes', 0),
  ('Sleep Support', 'For those struggling with sleep issues and insomnia.', '🌙', 'Sleep', 15, NOW() + INTERVAL '12 hours', 0),
  ('Work-Life Balance', 'Navigate the challenges of balancing work and personal life.', '⚖️', 'Work', 20, NOW() + INTERVAL '2 days', 0),
  ('Relationship Talk', 'Discuss relationship challenges and growth.', '❤️', 'Relationships', 12, NOW() + INTERVAL '5 hours', 0),
  ('Burnout Recovery', 'Support for those experiencing or recovering from burnout.', '🔥', 'Burnout', 15, NOW() + INTERVAL '8 hours', 0),
  ('Social Anxiety', 'A gentle space for those with social anxiety.', '🦋', 'Social Anxiety', 10, NOW() + INTERVAL '1 hour', 0),
  ('Positive Vibes Only', 'Share wins, gratitude, and positive moments.', '✨', 'Positivity', 30, NOW() + INTERVAL '45 minutes', 0)
ON CONFLICT DO NOTHING;

-- Create a function to update member_count when users join/leave circles
CREATE OR REPLACE FUNCTION public.update_circle_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.circles 
    SET member_count = COALESCE(member_count, 0) + 1 
    WHERE id = NEW.circle_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.circles 
    SET member_count = GREATEST(COALESCE(member_count, 0) - 1, 0) 
    WHERE id = OLD.circle_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-updating member count
DROP TRIGGER IF EXISTS trigger_update_circle_member_count ON public.user_circles;
CREATE TRIGGER trigger_update_circle_member_count
AFTER INSERT OR DELETE ON public.user_circles
FOR EACH ROW
EXECUTE FUNCTION public.update_circle_member_count();