-- Add note column to balloon_annotations table
ALTER TABLE balloon_annotations 
ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';

-- Add index for note searches if needed in the future
CREATE INDEX IF NOT EXISTS idx_balloon_annotations_note ON balloon_annotations(note) WHERE note != '';