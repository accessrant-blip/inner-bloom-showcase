-- First sanitize any existing usernames that don't meet criteria
UPDATE profiles
SET username = substring(
  regexp_replace(
    regexp_replace(COALESCE(username, ''), '[^a-zA-Z0-9_\- ]', '', 'g'),
    '\s+', ' ', 'g'
  ), 1, 50
)
WHERE username !~ '^[a-zA-Z0-9_\- ]+$' OR username IS NULL;

-- Fix any usernames that became too short after sanitization
UPDATE profiles
SET username = 'user_' || substring(user_id::text, 1, 8)
WHERE length(trim(COALESCE(username, ''))) < 3;

-- Add CHECK constraint to profiles.username for defense-in-depth
ALTER TABLE profiles
ADD CONSTRAINT valid_username
CHECK (
  username !~ '<[^>]*>' AND  -- No HTML tags
  username !~ E'[\\x00-\\x1F\\x7F]' AND  -- No control characters
  username ~ '^[a-zA-Z0-9_\- ]+$' AND  -- Only allowed chars
  length(username) BETWEEN 3 AND 50
);