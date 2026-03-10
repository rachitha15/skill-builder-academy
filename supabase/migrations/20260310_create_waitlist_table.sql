-- Create waitlist table to store email signups
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  total_xp INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist(email);

-- Add index on created_at for sorting
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON public.waitlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (join waitlist)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reading (for admin/dashboard)
CREATE POLICY "Anyone can read waitlist" ON public.waitlist
  FOR SELECT
  USING (true);

-- Add comment
COMMENT ON TABLE public.waitlist IS 'Stores email addresses from users who complete the course and join the waitlist';
