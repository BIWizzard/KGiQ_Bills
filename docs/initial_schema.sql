-- 1. Enable UUID generation if not already enabled
-- (Run this first in a separate query if unsure, it might already be active)
-- create extension if not exists "uuid-ossp"; 

-- 2. Create the income_events table
CREATE TABLE public.income_events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source text NOT NULL,
  expected_date date NOT NULL, -- Using DATE type, can change to TIMESTAMPTZ if time matters
  expected_amount numeric NOT NULL CHECK (expected_amount >= 0), -- Ensure non-negative
  is_recurring boolean NOT NULL DEFAULT false,
  notes text NULL,
  -- actual_date date NULL, -- Add later
  -- actual_amount numeric NULL CHECK (actual_amount >= 0), -- Add later
  -- recurrence_rule text NULL, -- Add later for recurring events
  CONSTRAINT income_events_pkey PRIMARY KEY (id)
);

-- Add comment descriptions to columns (optional but good practice)
COMMENT ON COLUMN public.income_events.user_id IS 'Links to the authenticated user';
COMMENT ON COLUMN public.income_events.source IS 'Source of the income (e.g., Employer Name, Client)';
COMMENT ON COLUMN public.income_events.expected_date IS 'Date the income is expected';
COMMENT ON COLUMN public.income_events.expected_amount IS 'Amount of income expected';
COMMENT ON COLUMN public.income_events.is_recurring IS 'Is this a recurring income event?';
COMMENT ON COLUMN public.income_events.notes IS 'Optional user notes';


-- 3. Create the bill_events table
CREATE TABLE public.bill_events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payee text NOT NULL,
  description text NULL,
  due_date date NOT NULL, -- Using DATE type
  amount_due numeric NOT NULL CHECK (amount_due >= 0),
  is_recurring boolean NOT NULL DEFAULT false,
  payment_method text NULL,
  notes text NULL,
  -- recurrence_rule text NULL, -- Add later for recurring events
  CONSTRAINT bill_events_pkey PRIMARY KEY (id)
);

-- Add comment descriptions
COMMENT ON COLUMN public.bill_events.user_id IS 'Links to the authenticated user';
COMMENT ON COLUMN public.bill_events.payee IS 'Who the bill is paid to (e.g., Utility Company, Landlord)';
COMMENT ON COLUMN public.bill_events.description IS 'Optional description of the bill';
COMMENT ON COLUMN public.bill_events.due_date IS 'Date the bill payment is due';
COMMENT ON COLUMN public.bill_events.amount_due IS 'The total amount due for the bill';
COMMENT ON COLUMN public.bill_events.is_recurring IS 'Is this a recurring bill?';
COMMENT ON COLUMN public.bill_events.payment_method IS 'How the bill is typically paid (e.g., Auto-Pay, CC, Check)';
COMMENT ON COLUMN public.bill_events.notes IS 'Optional user notes';


-- 4. Enable Row Level Security (RLS) for the tables
-- IMPORTANT: Do this AFTER creating tables and BEFORE creating policies
ALTER TABLE public.income_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_events ENABLE ROW LEVEL SECURITY;


-- 5. Create RLS Policies to ensure users only access their own data

-- Policies for income_events
CREATE POLICY "Allow ALL access for authenticated users own income"
ON public.income_events
FOR ALL -- Applies to SELECT, INSERT, UPDATE, DELETE
USING (auth.uid() = user_id) -- Checks existing rows for SELECT, UPDATE, DELETE
WITH CHECK (auth.uid() = user_id); -- Checks new/updated rows for INSERT, UPDATE

-- Policies for bill_events
CREATE POLICY "Allow ALL access for authenticated users own bills"
ON public.bill_events
FOR ALL -- Applies to SELECT, INSERT, UPDATE, DELETE
USING (auth.uid() = user_id) -- Checks existing rows for SELECT, UPDATE, DELETE
WITH CHECK (auth.uid() = user_id); -- Checks new/updated rows for INSERT, UPDATE