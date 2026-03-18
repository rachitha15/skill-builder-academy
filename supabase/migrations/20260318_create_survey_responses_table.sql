-- Create survey_responses table to store anonymous survey submissions
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  q1_frequency TEXT NOT NULL,
  q2_usage JSONB NOT NULL,
  q3_frustration TEXT NOT NULL,
  q4_learning_priority TEXT NOT NULL,
  q5_role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index on created_at for sorting
CREATE INDEX IF NOT EXISTS survey_responses_created_at_idx ON public.survey_responses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts only
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Allow anonymous inserts'
  ) THEN
    CREATE POLICY "Allow anonymous inserts" ON public.survey_responses
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Deny SELECT, UPDATE, DELETE for anon users (only admin can view in dashboard)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Deny anonymous reads'
  ) THEN
    CREATE POLICY "Deny anonymous reads" ON public.survey_responses
      FOR SELECT
      USING (false);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Deny anonymous updates'
  ) THEN
    CREATE POLICY "Deny anonymous updates" ON public.survey_responses
      FOR UPDATE
      USING (false);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Deny anonymous deletes'
  ) THEN
    CREATE POLICY "Deny anonymous deletes" ON public.survey_responses
      FOR DELETE
      USING (false);
  END IF;
END $$;

-- Add comment
COMMENT ON TABLE public.survey_responses IS 'Stores anonymous survey responses about AI usage and learning preferences';
