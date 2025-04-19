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