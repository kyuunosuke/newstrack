-- Add category field to topics table
ALTER TABLE topics ADD COLUMN category TEXT DEFAULT 'Technology';

-- Update existing topics with categories
UPDATE topics SET category = 'Politics' WHERE title LIKE '%Election%' OR title LIKE '%Congress%';
UPDATE topics SET category = 'Technology' WHERE title LIKE '%AI%' OR title LIKE '%Tech%' OR title LIKE '%Apple%';
UPDATE topics SET category = 'Business' WHERE title LIKE '%Stock%' OR title LIKE '%Market%' OR title LIKE '%Economy%';
UPDATE topics SET category = 'Science' WHERE title LIKE '%Climate%' OR title LIKE '%Space%' OR title LIKE '%Research%';
UPDATE topics SET category = 'World' WHERE title LIKE '%Ukraine%' OR title LIKE '%China%' OR title LIKE '%Global%';

-- Create user_follows table for tracking followed topics
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Enable RLS on user_follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own follows
CREATE POLICY "Users can view own follows"
  ON user_follows FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can follow topics
CREATE POLICY "Users can follow topics"
  ON user_follows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can unfollow topics
CREATE POLICY "Users can unfollow topics"
  ON user_follows FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_user_follows_user_id ON user_follows(user_id);
CREATE INDEX idx_user_follows_topic_id ON user_follows(topic_id);
