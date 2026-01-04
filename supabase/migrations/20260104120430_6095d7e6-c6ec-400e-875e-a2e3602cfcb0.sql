-- Add input validation for professional names to prevent XSS

-- First sanitize any existing names that might have HTML
UPDATE professionals
SET name = regexp_replace(name, '<[^>]*>', '', 'g')
WHERE name ~ '<[^>]*>';

-- Add check constraint to professionals.name to only allow safe characters
-- Allows: letters (including unicode), numbers, spaces, periods, hyphens, apostrophes, commas
ALTER TABLE professionals
ADD CONSTRAINT valid_professional_name 
CHECK (
  name !~ '<[^>]*>' AND  -- No HTML tags
  name !~ '[\x00-\x1F\x7F]' AND  -- No control characters
  length(name) BETWEEN 2 AND 100
);

-- Update the notify_booking_created function to sanitize professional name
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
    
    -- Sanitize name: remove any HTML/script tags and trim
    v_professional_name := regexp_replace(COALESCE(v_professional_name, ''), '<[^>]*>', '', 'g');
    v_professional_name := trim(v_professional_name);
    
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.user_id,
      'booking_pending',
      'Booking Created - Payment Pending',
      CASE 
        WHEN v_professional_name IS NOT NULL AND v_professional_name != '' THEN
          'Please complete your payment for the session with ' || v_professional_name || '.'
        ELSE
          'Please complete your payment for your session.'
      END
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Update notify_call_status function to also sanitize names
CREATE OR REPLACE FUNCTION public.notify_call_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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