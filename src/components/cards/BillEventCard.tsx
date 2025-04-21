// src/components/cards/BillEventCard.tsx
import React from 'react';
import { formatDate, formatCurrency, BillStatus } from '../../types';

// Define the expected props based on our enhanced bill event data
interface BillEventCardProps {
  payee: string;
  amount_due: number;
  due_date: string; // 'YYYY-MM-DD'
  description?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  // New fields for T16
  status?: string;
  remaining_amount?: number | null;
}

const BillEventCard: React.FC<BillEventCardProps> = ({
  payee,
  amount_due,
  due_date,
  description,
  payment_method,
  notes,
  status = BillStatus.UNPAID,
  remaining_amount
}) => {
  // Format the date for display
  const formattedDate = formatDate(due_date);

  // Determine if there's a remaining amount different from the total
  const hasPartialPayment = remaining_amount !== null && 
                            remaining_amount !== undefined && 
                            remaining_amount < amount_due;

  // Get status badge color
  const getStatusBadgeClass = () => {
    switch (status) {
      case BillStatus.PAID:
        return 'bg-green-600 text-white';
      case BillStatus.SCHEDULED:
        return 'bg-yellow-500 text-gray-800';
      case BillStatus.UNPAID:
      default:
        return 'bg-kg-wine text-white';
    }
  };

  return (
    <div className="p-3 rounded shadow-lg bg-white dark:bg-kg-gray border border-gray-200 dark:border-kg-ash/50 text-sm w-64">
      <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-kg-ash/50 pb-1">
        <h4 className="font-semibold text-base text-kg-wine dark:text-kg-wine">
          Bill: {payee}
        </h4>
        <span className={`px-2 py-0.5 text-xs rounded ${getStatusBadgeClass()}`}>
          {status}
        </span>
      </div>
      
      <div className="space-y-1 dark:text-kg-green2">
        <p><strong className="dark:text-kg-green">Due Date:</strong> {formattedDate}</p>
        
        <p><strong className="dark:text-kg-green">Total Due:</strong> {formatCurrency(amount_due)}</p>
        
        {hasPartialPayment && (
          <p>
            <strong className="dark:text-kg-green">Remaining:</strong> {formatCurrency(remaining_amount || 0)}
            <span className="ml-1 text-xs text-gray-600 dark:text-kg-ash">
              ({Math.round(((amount_due - (remaining_amount || 0)) / amount_due) * 100)}% covered)
            </span>
          </p>
        )}
        
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