-- SQL Script for T17: Enhanced Allocation Management
-- Run this in the Supabase SQL Editor to prepare for Task T17

-- Step 1: Add status and scheduled_date fields to allocations table
ALTER TABLE public.allocations 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'canceled')),
ADD COLUMN scheduled_date DATE NOT NULL;

-- Step 2: Update comment to document the new fields
COMMENT ON COLUMN public.allocations.status IS 'Payment status: pending, paid, or canceled';
COMMENT ON COLUMN public.allocations.scheduled_date IS 'Date the allocation payment is scheduled';

-- Step 3: Add a "canceled" status option to bill_events table
ALTER TABLE public.bill_events 
DROP CONSTRAINT bill_events_status_check, 
ADD CONSTRAINT bill_events_status_check CHECK (status IN ('unpaid', 'scheduled', 'paid', 'canceled'));

-- Step 4: Create function to update bill status based on its allocations
CREATE OR REPLACE FUNCTION public.update_bill_status_from_allocations()
RETURNS TRIGGER AS $$
DECLARE
    v_bill_id UUID;
    v_total_allocated NUMERIC;
    v_total_paid NUMERIC;
    v_bill_amount NUMERIC;
    v_allocation_count INTEGER;
    v_paid_allocation_count INTEGER;
    v_canceled_allocation_count INTEGER;
BEGIN
    -- Get the bill ID based on whether we're working with INSERT, UPDATE, or DELETE
    IF TG_OP = 'DELETE' THEN
        v_bill_id := OLD.bill_event_id;
    ELSE
        v_bill_id := NEW.bill_event_id;
    END IF;
    
    -- Get the bill amount
    SELECT amount_due INTO v_bill_amount
    FROM public.bill_events
    WHERE id = v_bill_id;
    
    -- Count allocations and calculate totals
    SELECT 
        COUNT(*),
        SUM(CASE WHEN status != 'canceled' THEN allocated_amount ELSE 0 END),
        SUM(CASE WHEN status = 'paid' THEN allocated_amount ELSE 0 END),
        COUNT(CASE WHEN status = 'paid' THEN 1 ELSE NULL END),
        COUNT(CASE WHEN status = 'canceled' THEN 1 ELSE NULL END)
    INTO 
        v_allocation_count,
        v_total_allocated,
        v_total_paid,
        v_paid_allocation_count,
        v_canceled_allocation_count
    FROM public.allocations
    WHERE bill_event_id = v_bill_id;
    
    -- Handle NULL results
    v_total_allocated := COALESCE(v_total_allocated, 0);
    v_total_paid := COALESCE(v_total_paid, 0);
    
    -- Update the bill's remaining amount and status
    UPDATE public.bill_events
    SET 
        remaining_amount = amount_due - v_total_allocated,
        status = CASE 
            -- If all allocations are canceled and there are no other allocations
            WHEN v_canceled_allocation_count > 0 AND v_canceled_allocation_count = v_allocation_count THEN 'unpaid'
            -- If all non-canceled allocations are marked as paid and the bill is fully allocated
            WHEN v_paid_allocation_count > 0 AND v_total_paid >= v_bill_amount THEN 'paid'
            -- If there are some allocations but not all are paid or the bill isn't fully allocated
            WHEN v_total_allocated > 0 THEN 'scheduled'
            -- Otherwise bill is unpaid
            ELSE 'unpaid'
        END
    WHERE id = v_bill_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger to automatically update bill status when allocations change
DROP TRIGGER IF EXISTS allocation_status_update ON public.allocations;
CREATE TRIGGER allocation_status_update
AFTER INSERT OR UPDATE OR DELETE ON public.allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_bill_status_from_allocations();

-- Step 6: Create function to check available income amount before allocation
CREATE OR REPLACE FUNCTION public.check_available_income()
RETURNS TRIGGER AS $$
DECLARE
    v_income_id UUID;
    v_income_amount NUMERIC;
    v_allocated_amount NUMERIC;
    v_available_amount NUMERIC;
BEGIN
    -- Get income amount
    SELECT expected_amount INTO v_income_amount
    FROM public.income_events
    WHERE id = NEW.income_event_id;
    
    -- Calculate current allocated amount from this income (excluding the current allocation if it's an update)
    SELECT COALESCE(SUM(allocated_amount), 0) INTO v_allocated_amount
    FROM public.allocations
    WHERE 
        income_event_id = NEW.income_event_id 
        AND status != 'canceled'
        AND (TG_OP != 'UPDATE' OR id != NEW.id);
    
    -- Calculate available amount
    v_available_amount := v_income_amount - v_allocated_amount;
    
    -- Check if enough funds available
    IF NEW.allocated_amount > v_available_amount THEN
        RAISE EXCEPTION 'Insufficient funds in income source. Available: %, Requested: %', 
            v_available_amount, NEW.allocated_amount;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger to check available income before allocation
DROP TRIGGER IF EXISTS check_income_before_allocation ON public.allocations;
CREATE TRIGGER check_income_before_allocation
BEFORE INSERT OR UPDATE ON public.allocations
FOR EACH ROW
EXECUTE FUNCTION public.check_available_income();

-- Step 8: Initial data migration - Set scheduled_date to due_date for existing allocations
UPDATE public.allocations a
SET scheduled_date = b.due_date
FROM public.bill_events b
WHERE a.bill_event_id = b.id
AND a.scheduled_date IS NULL;