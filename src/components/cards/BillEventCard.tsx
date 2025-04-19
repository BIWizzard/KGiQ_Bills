// src/components/cards/BillEventCard.tsx
import React from 'react';
import { format } from 'date-fns'; // For formatting dates

// Define the expected props based on our bill event data
interface BillEventCardProps {
  payee: string;
  amount_due: number;
  due_date: string; // 'YYYY-MM-DD'
  description?: string | null;
  payment_method?: string | null;
  notes?: string | null;
}

// Helper function for currency formatting (can be reused or imported from a utils file later)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const BillEventCard: React.FC<BillEventCardProps> = ({
  payee,
  amount_due,
  due_date,
  description,
  payment_method,
  notes
}) => {

  // Format the date for display
  const formattedDate = due_date ? format(new Date(`${due_date}T00:00:00`), 'MMM d, yyyy') : 'N/A';

  return (
    // Using same styling as IncomeEventCard for consistency
    <div className="p-3 rounded shadow-lg bg-white dark:bg-kg-gray border border-gray-200 dark:border-kg-ash/50 text-sm w-64"> 
      <h4 className="font-semibold text-base mb-2 text-kg-wine dark:text-kg-wine border-b border-gray-200 dark:border-kg-ash/50 pb-1"> {/* Using kg-wine color */}
        Bill: {payee}
      </h4>
      <div className="space-y-1 dark:text-kg-green2"> {/* Default text color */}
        <p><strong className="dark:text-kg-green">Amount Due:</strong> {formatCurrency(amount_due)}</p>
        <p><strong className="dark:text-kg-green">Due Date:</strong> {formattedDate}</p>
        {description && (
          <p><strong className="dark:text-kg-green">Description:</strong> {description}</p>
        )}
         {payment_method && (
          <p><strong className="dark:text-kg-green">Method:</strong> {payment_method}</p>
        )}
        {notes && (
          <p><strong className="dark:text-kg-green">Notes:</strong> {notes}</p>
        )}
      </div>
    </div>
  );
};

export default BillEventCard;