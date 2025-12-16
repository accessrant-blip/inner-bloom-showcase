-- Fix: Sanitize username in handle_new_user() to prevent stored XSS
-- This adds input validation for usernames from raw_user_meta_data

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Extract username from metadata or email
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  
  -- Sanitize: allow only alphanumeric, underscore, hyphen, spaces
  -- This removes any HTML tags, script injection, and SQL special chars
  v_username := regexp_replace(v_username, '[^a-zA-Z0-9_\- ]', '', 'g');
  
  -- Trim whitespace
  v_username := trim(v_username);
  
  -- Ensure minimum length, fallback to user ID prefix
  IF length(v_username) < 3 THEN
    v_username := 'user_' || substring(NEW.id::text, 1, 8);
  END IF;
  
  -- Limit length to 50 characters
  v_username := substring(v_username, 1, 50);
  
  INSERT INTO public.profiles (user_id, username, bio)
  VALUES (
    NEW.id,
    v_username,
    'Hello! Welcome to my peaceful space 💫'
  );
  
  INSERT INTO public.private_info (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;