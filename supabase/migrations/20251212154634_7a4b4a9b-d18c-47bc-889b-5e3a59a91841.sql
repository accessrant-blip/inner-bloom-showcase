-- Add a system_message column to messages table for join/leave messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_system_message boolean DEFAULT false;