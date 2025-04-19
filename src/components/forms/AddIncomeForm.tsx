// src/components/forms/AddIncomeForm.tsx (Updated with Datalist)
import { useState, useEffect } from 'react'; // Import useEffect
import { supabase } from '../../lib/supabaseClient'; 

const AddIncomeForm: React.FC = () => {
  const [source, setSource] = useState<string>('');
  const [expectedDate, setExpectedDate] = useState<string>(''); 
  const [expectedAmount, setExpectedAmount] = useState<string>(''); 
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // State for storing distinct sources for autocomplete
  const [sourceOptions, setSourceOptions] = useState<string[]>([]);
  const [loadingSources, setLoadingSources] = useState<boolean>(true);

  // Effect to fetch distinct sources on component mount
  useEffect(() => {
    const fetchSources = async () => {
      setLoadingSources(true);
      try {
        // Call the PostgreSQL function we created
        const { data, error: rpcError } = await supabase.rpc('get_distinct_income_sources');

        if (rpcError) {
          throw rpcError;
        }

        // The function returns an array of objects like [{ source: 'Name1' }, { source: 'Name2' }]
        // We extract just the source names into a string array
        if (data) {
          setSourceOptions(data.map((item: { source: string }) => item.source));
        }
        
      } catch (error: any) {
        console.error("Error fetching income sources:", error);
        // Don't block form usage if sources fail to load, just won't have suggestions
      } finally {
        setLoadingSources(false);
      }
    };

    fetchSources();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const amount = parseFloat(expectedAmount);
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid non-negative amount.');
      setLoading(false);
      return;
    }
    if (!expectedDate) {
        setError('Please select an expected date.');
        setLoading(false);
        return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const incomeData = {
        user_id: user.id,
        source: source.trim(), // Trim whitespace from source before saving
        expected_date: expectedDate, 
        expected_amount: amount,
        notes: notes || null, 
      };

      const { error: insertError } = await supabase
        .from('income_events')
        .insert([incomeData]); 

      if (insertError) throw insertError;

      setMessage('Income event added successfully!');
      
      // Add the newly submitted source to our options if it's not already there
      if (!sourceOptions.includes(source.trim())) {
         setSourceOptions(prev => [...prev, source.trim()].sort());
      }

      // Clear the form
      setSource('');
      setExpectedDate('');
      setExpectedAmount('');
      setNotes('');

    } catch (error: any) {
      setError(`Failed to add income event: ${error.message || 'Unknown error'}`);
      console.error('Error adding income event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 mb-8 p-6 bg-white rounded shadow-md dark:bg-kg-gray">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-kg-green">
        Add Income Event
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Source Input with Datalist */}
        <div className="mb-4">
          <label htmlFor="income-source" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Income Source</label>
          <input
            type="text"
            id="income-source"
            list="income-source-options" // Link input to datalist
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            disabled={loading || loadingSources} // Disable while loading sources too
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="e.g., Employer, Client Project"
          />
          {/* Datalist for autocomplete suggestions */}
          <datalist id="income-source-options">
            {sourceOptions.map((opt, index) => (
              <option key={index} value={opt} />
            ))}
          </datalist>
           {loadingSources && <p className="text-xs dark:text-kg-ash mt-1">Loading sources...</p>}
        </div>

        {/* Expected Date Input */}
        <div className="mb-4">
          {/* ... (keep date input as before) ... */}
           <label htmlFor="expected-date" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Expected Date</label>
          <input
            type="date" 
            id="expected-date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2"
          />
        </div>

        {/* Expected Amount Input */}
        <div className="mb-4">
          {/* ... (keep amount input as before) ... */}
          <label htmlFor="expected-amount" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Expected Amount</label>
          <input
            type="number"
            id="expected-amount"
            value={expectedAmount}
            onChange={(e) => setExpectedAmount(e.target.value)}
            required
            min="0" 
            step="0.01" 
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="e.g., 1500.00"
          />
        </div>

        {/* Notes Textarea */}
        <div className="mb-6">
          {/* ... (keep notes textarea as before) ... */}
           <label htmlFor="income-notes" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Notes (Optional)</label>
          <textarea
            id="income-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="Any relevant details..."
          />
        </div>

        {/* Submit Button */}
        {/* ... (keep submit button as before) ... */}
         <button
          type="submit"
          disabled={loading}
          className="w-full bg-kg-blue hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Income'}
        </button>


        {/* Message/Error Area */}
        {/* ... (keep message/error area as before) ... */}
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

export default AddIncomeForm;