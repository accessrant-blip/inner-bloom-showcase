-- Remove sensitive PII columns from scheduled_sessions table
-- This table is not actively used in the application and storing email/name
-- creates unnecessary risk of data exposure

-- First, drop the columns that store PII
ALTER TABLE public.scheduled_sessions DROP COLUMN IF EXISTS name;
ALTER TABLE public.scheduled_sessions DROP COLUMN IF EXISTS email;

-- Add a comment to document the change
COMMENT ON TABLE public.scheduled_sessions IS 'Stores scheduled session metadata. PII fields (name, email) removed for security - use user_id to reference user details from profiles table when needed.';