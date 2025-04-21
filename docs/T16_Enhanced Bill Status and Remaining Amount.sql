-- SQL Script for T16: Enhanced Bill Status and Remaining Amount
-- Run this in the Supabase SQL Editor to prepare for Task T16

-- Step 1: Add status and remaining_amount fields to bill_events table
ALTER TABLE public.bill_events 
ADD COLUMN status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'scheduled', 'paid')),
ADD COLUMN remaining_amount NUMERIC NULL;

-- Step 2: Update comment to document the new fields
COMMENT ON COLUMN public.bill_events.status IS 'Payment status: unpaid, scheduled, or paid';
COMMENT ON COLUMN public.bill_events.remaining_amount IS 'Remaining amount to be paid (NULL means same as amount_due)';

-- Step 3: Create a stored function to update bill status based on remaining amount
CREATE OR REPLACE FUNCTION public.update_bill_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If remaining_amount is NULL, set it to amount_due initially
  IF NEW.remaining_amount IS NULL THEN
    NEW.remaining_amount := NEW.amount_due;
  END IF;

  -- Update status based on remaining amount
  IF NEW.remaining_amount <= 0 THEN
    NEW.status := 'paid';
  ELSIF NEW.remaining_amount < NEW.amount_due THEN
    NEW.status := 'scheduled';
  ELSE
    NEW.status := 'unpaid';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create a trigger to automatically update bill status when remaining_amount changes
CREATE TRIGGER bill_status_update
BEFORE INSERT OR UPDATE ON public.bill_events
FOR EACH ROW
EXECUTE FUNCTION public.update_bill_status();

-- Step 5: Update remaining_amount for all existing bills to initialize them
UPDATE public.bill_events
SET remaining_amount = amount_due
WHERE remaining_amount IS NULL;

-- Step 6: Create a function to handle allocation creation and bill status update
CREATE OR REPLACE FUNCTION public.create_allocation_and_update_bill(
  p_user_id UUID,
  p_income_event_id UUID,
  p_bill_event_id UUID,
  p_allocated_amount NUMERIC
)
RETURNS VOID AS $$
DECLARE
  v_bill_remaining NUMERIC;
BEGIN
  -- Get the current remaining amount
  SELECT remaining_amount INTO v_bill_remaining
  FROM public.bill_events
  WHERE id = p_bill_event_id AND user_id = p_user_id;
  
  -- Create the allocation record
  INSERT INTO public.allocations(
    user_id, 
    income_event_id, 
    bill_event_id, 
    allocated_amount
  ) VALUES (
    p_user_id,
    p_income_event_id,
    p_bill_event_id,
    p_allocated_amount
  );
  
  -- Update the bill's remaining amount
  UPDATE public.bill_events
  SET remaining_amount = v_bill_remaining - p_allocated_amount
  WHERE id = p_bill_event_id AND user_id = p_user_id;
  
  -- The status will be updated automatically by the trigger
END;
$$ LANGUAGE plpgsql;
