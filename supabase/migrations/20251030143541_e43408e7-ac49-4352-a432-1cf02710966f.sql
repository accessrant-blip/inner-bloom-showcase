-- Create enum for professional roles
CREATE TYPE public.professional_role AS ENUM ('listener', 'therapist');

-- Create enum for availability status
CREATE TYPE public.availability_status AS ENUM ('online', 'offline', 'busy');

-- Create professionals table
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.professional_role NOT NULL,
  name TEXT NOT NULL,
  alias TEXT,
  bio TEXT NOT NULL,
  specialties TEXT[],
  profile_image_url TEXT,
  availability_status public.availability_status DEFAULT 'offline',
  rate_per_session NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create availability slots table
CREATE TABLE public.professional_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('chat', 'video')),
  session_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  payment_gateway TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professionals
CREATE POLICY "Professionals are viewable by everyone"
  ON public.professionals FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can update their own professional profile"
  ON public.professionals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own professional profile"
  ON public.professionals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for professional_availability
CREATE POLICY "Availability is viewable by everyone"
  ON public.professional_availability FOR SELECT
  USING (true);

CREATE POLICY "Professionals can manage their availability"
  ON public.professional_availability FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = professional_availability.professional_id
    AND professionals.user_id = auth.uid()
  ));

-- RLS Policies for sessions
CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.professionals WHERE id = sessions.professional_id
  ));

CREATE POLICY "Users can create sessions for their bookings"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.professionals WHERE id = sessions.professional_id
  ));

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.professionals WHERE id = payments.professional_id
  ));

CREATE POLICY "Users can create payments for their bookings"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update bookings table to link to professionals
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS professional_id UUID REFERENCES public.professionals(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 30;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS amount NUMERIC;

-- Create trigger for updating updated_at
CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample professionals
INSERT INTO public.professionals (name, alias, role, bio, specialties, rate_per_session, currency, is_verified, is_active, availability_status) VALUES
('Sarah Johnson', 'Peaceful Listener', 'listener', 'Empathetic listener trained in active listening. I''m here to hold space for your feelings without judgment.', ARRAY['Active Listening', 'Emotional Support', 'Life Transitions'], 250, 'INR', true, true, 'online'),
('Michael Chen', 'Compassionate Voice', 'listener', 'Here to listen with an open heart. Sometimes you just need someone to hear you.', ARRAY['Career Stress', 'Relationship Issues', 'Daily Struggles'], 250, 'INR', true, true, 'online'),
('Dr. Priya Sharma', NULL, 'therapist', 'Licensed clinical psychologist with 10+ years of experience specializing in anxiety and depression.', ARRAY['Anxiety', 'Depression', 'CBT', 'Mindfulness'], 1000, 'INR', true, true, 'online'),
('Dr. James Wilson', NULL, 'therapist', 'Certified therapist specializing in trauma and PTSD. Creating safe spaces for healing and growth.', ARRAY['Trauma', 'PTSD', 'EMDR', 'Grief Counseling'], 1000, 'INR', true, true, 'offline');