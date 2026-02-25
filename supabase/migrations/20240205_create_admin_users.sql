-- Create admin_users table to track admin privileges
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- RLS policies for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin_users table
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Allow admins to manage topics (full CRUD)
DROP POLICY IF EXISTS "Admins can insert topics" ON public.topics;
CREATE POLICY "Admins can insert topics"
  ON public.topics FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

DROP POLICY IF EXISTS "Admins can update topics" ON public.topics;
CREATE POLICY "Admins can update topics"
  ON public.topics FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

DROP POLICY IF EXISTS "Admins can delete topics" ON public.topics;
CREATE POLICY "Admins can delete topics"
  ON public.topics FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Allow admins to manage timeline_entries (full CRUD)
DROP POLICY IF EXISTS "Admins can insert timeline_entries" ON public.timeline_entries;
CREATE POLICY "Admins can insert timeline_entries"
  ON public.timeline_entries FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

DROP POLICY IF EXISTS "Admins can update timeline_entries" ON public.timeline_entries;
CREATE POLICY "Admins can update timeline_entries"
  ON public.timeline_entries FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

DROP POLICY IF EXISTS "Admins can delete timeline_entries" ON public.timeline_entries;
CREATE POLICY "Admins can delete timeline_entries"
  ON public.timeline_entries FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));
