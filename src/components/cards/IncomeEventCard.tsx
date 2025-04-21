// src/components/cards/IncomeEventCard.tsx
import React from 'react';
import { format } from 'date-fns'; // For formatting dates nicely

// Define the expected props based on our income event data
// We'll pass the 'extendedProps' from the FullCalendar event object here
interface IncomeEventCardProps {
  source: string;
  expected_amount: number;
  expected_date: string; // Should be 'YYYY-MM-DD' string
  notes?: string | null; // Optional notes
}

// Helper function for currency formatting (same as in CalendarView)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const IncomeEventCard: React.FC<IncomeEventCardProps> = ({
  source,
  expected_amount,
  expected_date,
  notes
}) => {
  
  // Format the date for display
  const formattedDate = expected_date ? format(new Date(`${expected_date}T00:00:00`), 'MMM d, yyyy') : 'N/A';
  // Adding T00:00:00 helps ensure date-fns parses the date string correctly regardless of timezone issues

  return (
    <div className="p-3 rounded shadow-lg bg-white dark:bg-kg-gray border border-gray-200 dark:border-kg-ash/50 text-sm w-64"> {/* Fixed width */}
      <h4 className="font-semibold text-base mb-2 text-kg-blue dark:text-kg-green border-b border-gray-200 dark:border-kg-ash/50 pb-1">
        Income: {source}
      </h4>
      <div className="space-y-1">
        <p><strong className="dark:text-kg-green2">Amount:</strong> {formatCurrency(expected_amount)}</p>
        <p><strong className="dark:text-kg-green2">Date:</strong> {formattedDate}</p>
        {notes && (
          <p><strong className="dark:text-kg-green2">Notes:</strong> {notes}</p>
        )}
      </div>
    </div>
  );
};

export default IncomeEventCard;