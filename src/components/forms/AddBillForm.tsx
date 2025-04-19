// src/components/forms/AddBillForm.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Adjust path if needed

const AddBillForm: React.FC = () => {
  // State for bill fields
  const [payee, setPayee] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(''); // HTML date input gives string 'YYYY-MM-DD'
  const [amountDue, setAmountDue] = useState<string>(''); // HTML number input gives string
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // State for distinct payees
  const [payeeOptions, setPayeeOptions] = useState<string[]>([]);
  const [loadingPayees, setLoadingPayees] = useState<boolean>(true);

  // State for form handling
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Effect to fetch distinct payees
  useEffect(() => {
    const fetchPayees = async () => {
      setLoadingPayees(true);
      try {
        const { data, error: rpcError } = await supabase.rpc('get_distinct_bill_payees');
        if (rpcError) throw rpcError;
        if (data) {
          setPayeeOptions(data.map((item: { payee: string }) => item.payee));
        }
      } catch (error: any) {
        console.error("Error fetching bill payees:", error);
      } finally {
        setLoadingPayees(false);
      }
    };
    fetchPayees();
  }, []);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const amount = parseFloat(amountDue);
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid non-negative amount.');
      setLoading(false);
      return;
    }
     if (!dueDate) {
        setError('Please select a due date.');
        setLoading(false);
        return;
    }


    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const billData = {
        user_id: user.id,
        payee: payee.trim(),
        description: description || null,
        due_date: dueDate,
        amount_due: amount,
        payment_method: paymentMethod || null,
        notes: notes || null,
        // is_recurring defaults to false in DB
      };

      const { error: insertError } = await supabase
        .from('bill_events')
        .insert([billData]); 

      if (insertError) throw insertError;

      setMessage('Bill event added successfully!');
      // Add new payee to options if unique
      if (!payeeOptions.includes(payee.trim())) {
        setPayeeOptions(prev => [...prev, payee.trim()].sort());
      }
      // Clear the form
      setPayee('');
      setDescription('');
      setDueDate('');
      setAmountDue('');
      setPaymentMethod('');
      setNotes('');

    } catch (error: any) {
      setError(`Failed to add bill event: ${error.message || 'Unknown error'}`);
      console.error('Error adding bill event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 mb-8 p-6 bg-white rounded shadow-md dark:bg-kg-gray">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-kg-green">
        Add Bill Event
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Payee Input with Datalist */}
        <div className="mb-4">
          <label htmlFor="bill-payee" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Payee</label>
          <input
            type="text"
            id="bill-payee"
            list="bill-payee-options" // Link to datalist
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
            required
            disabled={loading || loadingPayees}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="e.g., Electric Company, Credit Card"
          />
          <datalist id="bill-payee-options">
            {payeeOptions.map((opt, index) => (
              <option key={index} value={opt} />
            ))}
          </datalist>
           {loadingPayees && <p className="text-xs dark:text-kg-ash mt-1">Loading payees...</p>}
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="bill-description" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Description (Optional)</label>
          <input
            type="text"
            id="bill-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="e.g., Monthly Bill, Service for..."
          />
        </div>

        {/* Due Date Input */}
        <div className="mb-4">
           <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Due Date</label>
          <input
            type="date"
            id="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2"
          />
        </div>

        {/* Amount Due Input */}
        <div className="mb-4">
          <label htmlFor="amount-due" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Amount Due</label>
          <input
            type="number"
            id="amount-due"
            value={amountDue}
            onChange={(e) => setAmountDue(e.target.value)}
            required
            min="0"
            step="0.01"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="e.g., 95.50"
          />
        </div>

         {/* Payment Method Input */}
        <div className="mb-4">
          <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Payment Method (Optional)</label>
          <input
            type="text"
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="e.g., Auto-Pay, Visa ending 1234"
          />
        </div>

        {/* Notes Textarea */}
        <div className="mb-6">
           <label htmlFor="bill-notes" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Notes (Optional)</label>
          <textarea
            id="bill-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="Any relevant details..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-kg-blue hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Bill'}
        </button>

        {/* Message/Error Area */}
        {message && !error && (
          <p className="mt-4 text-sm text-center text-kg-green dark:text-kg-green">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">{error}</p>
        )}
      </form>
    </div>
  );
};

export default AddBillForm;