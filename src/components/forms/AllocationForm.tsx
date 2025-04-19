// src/components/forms/AllocationForm.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Define interfaces for the data we're working with
interface BillEvent {
  id: string;
  payee: string;
  due_date: string;
  amount_due: number;
  description?: string | null;
}

interface IncomeEvent {
  id: string;
  source: string;
  expected_date: string;
  expected_amount: number;
  allocated_amount?: number; // Total already allocated from this income
}

interface AllocationFormProps {
  billEvent: BillEvent;
  onSuccess: () => void;
  onCancel: () => void;
}

const AllocationForm: React.FC<AllocationFormProps> = ({
  billEvent,
  onSuccess,
  onCancel,
}) => {
  // State for form fields
  const [selectedIncomeId, setSelectedIncomeId] = useState<string>('');
  const [allocationAmount, setAllocationAmount] = useState<string>('');
  
  // State for available income events
  const [incomeEvents, setIncomeEvents] = useState<IncomeEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for form submission
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper function for formatting currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Helper to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate remaining unallocated amount for an income event
  const calculateRemainingAmount = (incomeEvent: IncomeEvent): number => {
    const allocatedAmount = incomeEvent.allocated_amount || 0;
    return incomeEvent.expected_amount - allocatedAmount;
  };

  // Fetch available income events
  useEffect(() => {
    const fetchIncomeEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
        
        // Get income events for the current user
        const { data: incomeData, error: incomeError } = await supabase
          .from('income_events')
          .select('id, source, expected_date, expected_amount')
          .eq('user_id', user.id)
          // Typically we'd want to only show income events before or on the bill due date
          // but for simplicity we'll show all income events initially
          .order('expected_date', { ascending: true });
          
        if (incomeError) throw incomeError;
        
        // Get existing allocations to calculate remaining amounts
        const { data: allocationsData, error: allocationsError } = await supabase
          .from('allocations')
          .select('income_event_id, allocated_amount')
          .eq('user_id', user.id);
          
        if (allocationsError) throw allocationsError;
        
        // Calculate total allocated amount for each income event
        const allocatedAmounts: Record<string, number> = {};
        
        allocationsData?.forEach(allocation => {
          if (!allocatedAmounts[allocation.income_event_id]) {
            allocatedAmounts[allocation.income_event_id] = 0;
          }
          allocatedAmounts[allocation.income_event_id] += allocation.allocated_amount;
        });
        
        // Add allocated_amount property to income events
        const incomeEventsWithAllocations = incomeData?.map(event => ({
          ...event,
          allocated_amount: allocatedAmounts[event.id] || 0
        })) || [];
        
        // Filter out income events that don't have any remaining amount
        const availableIncomeEvents = incomeEventsWithAllocations.filter(
          event => calculateRemainingAmount(event) > 0
        );
        
        setIncomeEvents(availableIncomeEvents);
      } catch (error: unknown) {
        console.error('Error fetching income events:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error';
        setError(`Failed to load income events: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncomeEvents();
  }, []);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    
    // Validate income selection
    if (!selectedIncomeId) {
      setFormError('Please select an income source');
      setSubmitting(false);
      return;
    }
    
    // Validate allocation amount
    const amount = parseFloat(allocationAmount);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Please enter a valid positive amount');
      setSubmitting(false);
      return;
    }
    
    // Find the selected income event
    const selectedIncome = incomeEvents.find(income => income.id === selectedIncomeId);
    if (!selectedIncome) {
      setFormError('Selected income source not found');
      setSubmitting(false);
      return;
    }
    
    // Check if allocation amount exceeds remaining amount
    const remainingAmount = calculateRemainingAmount(selectedIncome);
    if (amount > remainingAmount) {
      setFormError(`Allocation exceeds available amount (${formatCurrency(remainingAmount)})`);
      setSubmitting(false);
      return;
    }
    
    // Check if allocation amount exceeds bill amount
    if (amount > billEvent.amount_due) {
      setFormError(`Allocation exceeds bill amount (${formatCurrency(billEvent.amount_due)})`);
      setSubmitting(false);
      return;
    }
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
      
      // Create allocation record
      const { error: insertError } = await supabase
        .from('allocations')
        .insert([{
          user_id: user.id,
          income_event_id: selectedIncomeId,
          bill_event_id: billEvent.id,
          allocated_amount: amount
        }]);
        
      if (insertError) throw insertError;
      
      setSuccessMessage('Allocation created successfully!');
      
      // Clear form after success
      setSelectedIncomeId('');
      setAllocationAmount('');
      
      // Notify parent component of success
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    } catch (error: unknown) {
      console.error('Error creating allocation:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';
      setFormError(`Failed to create allocation: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Bill Details Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-kg-ash/10 rounded">
        <h4 className="font-medium text-gray-700 dark:text-kg-green mb-2">Bill Details:</h4>
        <p className="dark:text-kg-green2"><strong>Payee:</strong> {billEvent.payee}</p>
        <p className="dark:text-kg-green2"><strong>Due Date:</strong> {formatDate(billEvent.due_date)}</p>
        <p className="dark:text-kg-green2"><strong>Amount Due:</strong> {formatCurrency(billEvent.amount_due)}</p>
        {billEvent.description && (
          <p className="dark:text-kg-green2"><strong>Description:</strong> {billEvent.description}</p>
        )}
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <p className="dark:text-kg-green2">Loading available income sources...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={onCancel}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 dark:bg-kg-ash/50 dark:text-kg-green2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* No Income Available */}
      {!loading && !error && incomeEvents.length === 0 && (
        <div className="text-center py-4">
          <p className="dark:text-kg-green2 mb-2">No income sources with available funds found.</p>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-kg-ash/50 dark:text-kg-green2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Form Fields */}
      {!loading && !error && incomeEvents.length > 0 && (
        <>
          {/* Income Source Selection */}
          <div className="mb-4">
            <label 
              htmlFor="income-source" 
              className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1"
            >
              Income Source
            </label>
            <select
              id="income-source"
              value={selectedIncomeId}
              onChange={(e) => setSelectedIncomeId(e.target.value)}
              required
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2"
            >
              <option value="">Select an income source</option>
              {incomeEvents.map((income) => {
                const remainingAmount = calculateRemainingAmount(income);
                return (
                  <option key={income.id} value={income.id}>
                    {income.source} - {formatDate(income.expected_date)} - Available: {formatCurrency(remainingAmount)}
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* Allocation Amount */}
          <div className="mb-6">
            <label 
              htmlFor="allocation-amount" 
              className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1"
            >
              Amount to Allocate
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-kg-ash">
                $
              </span>
              <input
                type="number"
                id="allocation-amount"
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                disabled={submitting}
                className="w-full pl-7 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2"
                placeholder="0.00"
              />
            </div>
            {selectedIncomeId && (
              <div className="mt-1 text-xs text-gray-500 dark:text-kg-ash">
                <p>
                  {/* Show remaining amount if income is selected */}
                  {(() => {
                    const selectedIncome = incomeEvents.find(income => income.id === selectedIncomeId);
                    if (selectedIncome) {
                      const remainingAmount = calculateRemainingAmount(selectedIncome);
                      return `Available: ${formatCurrency(remainingAmount)} | Bill Amount: ${formatCurrency(billEvent.amount_due)}`;
                    }
                    return null;
                  })()}
                </p>
              </div>
            )}
          </div>
          
          {/* Form Error */}
          {formError && (
            <div className="mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{formError}</p>
            </div>
          )}
          
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4">
              <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-kg-ash/50 dark:text-kg-green2 rounded hover:bg-gray-300 dark:hover:bg-kg-ash/70 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-kg-ash"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-kg-blue text-white rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Allocation'}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default AllocationForm;