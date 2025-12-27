-- Fix Issue 1: Create database triggers for notifications
-- This automates notification creation and works with the existing RLS policy

-- Trigger for booking notifications (when booking is created with pending status)
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_professional_name TEXT;
BEGIN
  -- Only create notification for pending bookings with a user_id
  IF NEW.status = 'pending' AND NEW.user_id IS NOT NULL THEN
    -- Get professional name for the message
    SELECT name INTO v_professional_name
    FROM professionals
    WHERE id = NEW.professional_id;
    
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.user_id,
      'booking_pending',
      'Booking Created - Payment Pending',
      COALESCE('Please complete your payment for the session with ' || v_professional_name || '.', 'Please complete your payment for your session.')
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for booking notifications
DROP TRIGGER IF EXISTS booking_notification_trigger ON bookings;
CREATE TRIGGER booking_notification_trigger
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION public.notify_booking_created();

-- Trigger for call notifications
CREATE OR REPLACE FUNCTION public.notify_call_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_professional_user_id UUID;
BEGIN
  -- Get the professional's user_id for notifications
  SELECT user_id INTO v_professional_user_id
  FROM professionals
  WHERE id = NEW.professional_id;

  -- New call starting (connecting)
  IF TG_OP = 'INSERT' AND NEW.status = 'connecting' THEN
    -- Call started notification for client
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.user_id,
      'call_started',
      'Call Started',
      'Your session is connecting...'
    );
    
    -- Call started notification for professional (if they have a user_id)
    IF v_professional_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (
        v_professional_user_id,
        'call_started',
        'Incoming Call',
        'A client is calling you.'
      );
    END IF;
    
  -- Call connected
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'connected' AND (OLD.status IS NULL OR OLD.status != 'connected') THEN
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.user_id,
      'call_connected',
      'Connected',
      'You are now connected 🌿'
    );
    
  -- Call completed
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.user_id,
      'call_completed',
      'Session Completed',
      'Your session has ended. Please share your feedback!'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for call notifications
DROP TRIGGER IF EXISTS call_notification_trigger ON calls;
CREATE TRIGGER call_notification_trigger
AFTER INSERT OR UPDATE ON calls
FOR EACH ROW
EXECUTE FUNCTION public.notify_call_status();

-- Fix Issue 2: Fix scheduled_sessions NULL user_id bypass
-- First, delete any existing rows with NULL user_id (they shouldn't exist and are unprotected)
DELETE FROM scheduled_sessions WHERE user_id IS NULL;

-- Add NOT NULL constraint to user_id
ALTER TABLE scheduled_sessions
ALTER COLUMN user_id SET NOT NULL;

-- Update RLS policies to be simpler now that user_id is NOT NULL
DROP POLICY IF EXISTS "Users can view their own scheduled sessions" ON scheduled_sessions;
DROP POLICY IF EXISTS "Users can insert their own scheduled sessions" ON scheduled_sessions;
DROP POLICY IF EXISTS "Users can update their own scheduled sessions" ON scheduled_sessions;
DROP POLICY IF EXISTS "Users can delete their own scheduled sessions" ON scheduled_sessions;

CREATE POLICY "Users can view their own scheduled sessions"
ON scheduled_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled sessions"
ON scheduled_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled sessions"
ON scheduled_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled sessions"
ON scheduled_sessions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);