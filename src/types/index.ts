// src/types/index.ts
// Shared type definitions for the application

/**
 * Income event data structure
 */
export interface IncomeEvent {
  id: string;
  source: string;
  expected_date: string; // YYYY-MM-DD format
  expected_amount: number;
  notes?: string | null;
  allocated_amount?: number; // Total already allocated from this income
}

/**
 * Bill event data structure
 */
export interface BillEvent {
  id: string;
  payee: string;
  due_date: string; // YYYY-MM-DD format
  amount_due: number;
  description?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  // New fields for T16
  status?: 'unpaid' | 'scheduled' | 'paid';
  remaining_amount?: number | null;
}

/**
 * Bill status options
 */
export enum BillStatus {
  UNPAID = 'unpaid',
  SCHEDULED = 'scheduled',
  PAID = 'paid'
}

/**
 * Allocation data structure
 */
export interface Allocation {
  id: string;
  income_event_id: string;
  bill_event_id: string;
  allocated_amount: number;
  created_at?: string;
}

/**
 * Allocation summary for dashboard/reporting
 */
export interface AllocationSummary {
  totalIncome: number;
  allocatedIncome: number;
  totalBills: number;
  allocatedBills: number;
  totalBillCount: number;
  // New fields for T16
  unpaidBillCount: number;
  scheduledBillCount: number;
  paidBillCount: number;
}

/**
 * Helper formatting functions
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get color and text color for bill status
 */
export const getBillStatusColors = (status: string): { bg: string, text: string, border: string } => {
  switch (status) {
    case BillStatus.PAID:
      return { 
        bg: 'bg-green-600',
        text: 'text-white',
        border: 'border-green-700'
      };
    case BillStatus.SCHEDULED:
      return { 
        bg: 'bg-yellow-500',
        text: 'text-gray-800',
        border: 'border-yellow-600'
      };
    case BillStatus.UNPAID:
    default:
      return { 
        bg: 'bg-kg-wine',
        text: 'text-white',
        border: 'border-kg-wine/70'
      };
  }
};

/**
 * Get calendar event colors based on bill status
 */
export const getCalendarEventColors = (status: string): { backgroundColor: string, borderColor: string, textColor: string } => {
  switch (status) {
    case BillStatus.PAID:
      return {
        backgroundColor: '#22c55e', // green-600
        borderColor: '#15803d', // green-700
        textColor: '#ffffff'
      };
    case BillStatus.SCHEDULED:
      return {
        backgroundColor: '#eab308', // yellow-500
        borderColor: '#ca8a04', // yellow-600
        textColor: '#1f2937'  // gray-800
      };
    case BillStatus.UNPAID:
    default:
      return {
        backgroundColor: '#733041', // kg-wine
        borderColor: '#5f2735', // darker kg-wine
        textColor: '#ffffff'
      };
  }
};