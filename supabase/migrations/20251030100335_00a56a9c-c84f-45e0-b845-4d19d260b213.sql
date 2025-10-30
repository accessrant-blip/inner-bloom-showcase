-- Update the check constraint on rants table to allow 'anonymous' privacy value
ALTER TABLE public.rants
DROP CONSTRAINT IF EXISTS rants_privacy_check;

ALTER TABLE public.rants
ADD CONSTRAINT rants_privacy_check 
CHECK (privacy IN ('public', 'private', 'anonymous'));