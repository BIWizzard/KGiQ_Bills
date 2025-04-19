// src/pages/HomePage.tsx (Updated with AllocationSummary and links to Add forms)
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import CalendarView from '../components/calendar/CalendarView';
import Modal from '../components/common/Modal';
import AddIncomeForm from '../components/forms/AddIncomeForm';
import AddBillForm from '../components/forms/AddBillForm';

// Type for allocation summary data
interface AllocationSummary {
  totalIncome: number;
  allocatedIncome: number;
  totalBills: number;
  allocatedBills: number;
  totalBillCount: number; // Add this to track the total number of bills
}

const HomePage = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  const [allocationSummary, setAllocationSummary] = useState<AllocationSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  // State for modals
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState<boolean>(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false);

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Fetch allocation summary data
  const fetchAllocationSummary = async (userId: string) => {
    setLoadingSummary(true);
    setSummaryError(null);
    
    try {
      // Get total income
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_events')
        .select('expected_amount')
        .eq('user_id', userId);
        
      if (incomeError) throw incomeError;
      
      // Get total bills
      const { data: billData, error: billError } = await supabase
        .from('bill_events')
        .select('amount_due')
        .eq('user_id', userId);
        
      if (billError) throw billError;
      
      // Try to get allocations - this might fail if the table doesn't exist yet
      let allocatedAmount = 0;
      const allocatedBillIds = new Set();
      
      try {
        const { data: allocationsData, error: allocationsError } = await supabase
          .from('allocations')
          .select('allocated_amount, bill_event_id')
          .eq('user_id', userId);
          
        if (!allocationsError && allocationsData) {
          // Calculate total allocated amount for each income event
          allocatedAmount = allocationsData.reduce(
            (sum, item) => sum + (item.allocated_amount || 0), 
            0
          );
          
          // Count unique allocated bill events
          allocationsData.forEach(allocation => {
            if (allocation.bill_event_id) {
              allocatedBillIds.add(allocation.bill_event_id);
            }
          });
        }
      } catch (allocError) {
        console.warn('Allocations data not available yet:', allocError);
        // Continue without allocation data
      }
      
      // Calculate totals
      const totalIncome = incomeData?.reduce((sum, item) => sum + (item.expected_amount || 0), 0) || 0;
      const totalBills = billData?.reduce((sum, item) => sum + (item.amount_due || 0), 0) || 0;
      
      setAllocationSummary({
        totalIncome,
        allocatedIncome: allocatedAmount,
        totalBills,
        allocatedBills: allocatedBillIds.size,
        totalBillCount: billData?.length || 0
      });
    } catch (error: unknown) {
      console.error('Error fetching allocation summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSummaryError(`Failed to load summary: ${errorMessage}`);
    } finally {
      setLoadingSummary(false);
    }
  };
  
  // Create a function to refresh the allocation summary
  const refreshAllocationSummary = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await fetchAllocationSummary(user.id);
    }
  };

  // Fetch user and allocation summary
  useEffect(() => {
    const fetchUserAndSummary = async () => {
      // Fetch user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserEmail(user?.email);
      
      // Only fetch summary if we have a valid user
      if (user) {
        await fetchAllocationSummary(user.id);
      }
    };
    
    fetchUserAndSummary();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  // Handle closing modals and refreshing data
  const handleIncomeModalClose = () => {
    setIsIncomeModalOpen(false);
    // Refresh user and summary data
    refreshAllocationSummary();
  };
  
  const handleBillModalClose = () => {
    setIsBillModalOpen(false);
    // Refresh user and summary data
    refreshAllocationSummary();
  };

  return (
    // Main container
    <div>
      {/* Welcome box with user info and allocation summary */}
      <div className="bg-white p-6 rounded shadow dark:bg-kg-gray mb-6"> 
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-kg-green">
            Welcome to KG iQ Bills Tracker
          </h2>
          <button
            onClick={handleLogout}
            className="bg-kg-wine hover:bg-opacity-90 text-white font-semibold py-1 px-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray"
          >
            Logout
          </button>
        </div>
        
        {currentUserEmail ? (
          <p className="mb-4 text-gray-700 dark:text-kg-green2">Logged in as: {currentUserEmail}</p>
        ) : (
          <p className="mb-4 text-gray-700 dark:text-kg-green2">Loading user info...</p>
        )}
        
        {/* Allocation Summary */}
        <div className="mt-6 border-t border-gray-200 dark:border-kg-ash/30 pt-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-kg-green mb-3">Financial Summary</h3>
          
          {loadingSummary ? (
            <p className="text-gray-500 dark:text-kg-ash">Loading summary data...</p>
          ) : summaryError ? (
            <p className="text-red-500 dark:text-red-400">{summaryError}</p>
          ) : allocationSummary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-kg-ash/10 p-3 rounded">
                <h4 className="font-medium text-gray-700 dark:text-kg-green2 mb-2">Income</h4>
                <p className="dark:text-kg-green2">Total: {formatCurrency(allocationSummary.totalIncome)}</p>
                <p className="dark:text-kg-green2">Allocated: {formatCurrency(allocationSummary.allocatedIncome)}</p>
                <p className="dark:text-kg-green2">
                  Remaining: {formatCurrency(allocationSummary.totalIncome - allocationSummary.allocatedIncome)}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-kg-ash/10 p-3 rounded">
                <h4 className="font-medium text-gray-700 dark:text-kg-green2 mb-2">Bills</h4>
                <p className="dark:text-kg-green2">Total: {formatCurrency(allocationSummary.totalBills)}</p>
                <p className="dark:text-kg-green2">
                  Bills with Allocations: {allocationSummary.allocatedBills} / {allocationSummary.totalBillCount}
                </p>
                <p className="dark:text-kg-green2">
                  Coverage: {formatCurrency(allocationSummary.allocatedIncome)} / {formatCurrency(allocationSummary.totalBills)}
                  {allocationSummary.totalBills > 0 && (
                    <span className="ml-1">
                      ({Math.round((allocationSummary.allocatedIncome / allocationSummary.totalBills) * 100)}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-kg-ash">No summary data available.</p>
          )}
          
          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="px-3 py-1.5 bg-kg-green text-kg-blue rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray"
            >
              Add Income
            </button>
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="px-3 py-1.5 bg-kg-wine text-white rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray"
            >
              Add Bill
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <CalendarView onAllocationChange={refreshAllocationSummary} />
      
      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={handleIncomeModalClose}
        title="Add Income Event"
        size="md"
      >
        <AddIncomeForm />
      </Modal>
      
      {/* Bill Modal */}
      <Modal
        isOpen={isBillModalOpen}
        onClose={handleBillModalClose}
        title="Add Bill Event"
        size="md"
      >
        <AddBillForm />
      </Modal>
    </div> 
  );
};

export default HomePage;