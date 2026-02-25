-- Add public read access policy for topics
DROP POLICY IF EXISTS "Public read access" ON topics;
CREATE POLICY "Public read access"
  ON topics FOR SELECT
  USING (true);

-- Add public read access policy for timeline_entries
DROP POLICY IF EXISTS "Public read access" ON timeline_entries;
CREATE POLICY "Public read access"
  ON timeline_entries FOR SELECT
  USING (true);
