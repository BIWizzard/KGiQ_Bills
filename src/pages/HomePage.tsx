// src/pages/HomePage.tsx (Fixed unused variable)
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import CalendarView from '../components/calendar/CalendarView';
import Modal from '../components/common/Modal';
import AddIncomeForm from '../components/forms/AddIncomeForm';
import AddBillForm from '../components/forms/AddBillForm';
import { formatCurrency, BillStatus, AllocationSummary } from '../types';

const HomePage = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  const [allocationSummary, setAllocationSummary] = useState<AllocationSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  // State for modals
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState<boolean>(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false);

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
      
      // Get bills with status info
      const { data: billData, error: billError } = await supabase
        .from('bill_events')
        .select('amount_due, status, remaining_amount')
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
          // Calculate total allocated amount
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
      
      // Count bills by status
      const unpaidBillCount = billData?.filter(bill => 
        bill.status === BillStatus.UNPAID || !bill.status
      ).length || 0;
      
      const scheduledBillCount = billData?.filter(bill => 
        bill.status === BillStatus.SCHEDULED
      ).length || 0;
      
      const paidBillCount = billData?.filter(bill => 
        bill.status === BillStatus.PAID
      ).length || 0;
      
      // Calculate totals
      const totalIncome = incomeData?.reduce((sum, item) => sum + (item.expected_amount || 0), 0) || 0;
      const totalBills = billData?.reduce((sum, item) => sum + (item.amount_due || 0), 0) || 0;
      
      setAllocationSummary({
        totalIncome,
        allocatedIncome: allocatedAmount,
        totalBills,
        allocatedBills: allocatedBillIds.size,
        totalBillCount: billData?.length || 0,
        unpaidBillCount,
        scheduledBillCount,
        paidBillCount
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

  // Helper function to get color class for progress bar
  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 50) return 'bg-yellow-400';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
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
              {/* Income Panel */}
              <div className="bg-gray-50 dark:bg-kg-ash/10 p-3 rounded">
                <h4 className="font-medium text-gray-700 dark:text-kg-green2 mb-2">Income</h4>
                <p className="dark:text-kg-green2">Total: {formatCurrency(allocationSummary.totalIncome)}</p>
                <p className="dark:text-kg-green2">Allocated: {formatCurrency(allocationSummary.allocatedIncome)}</p>
                <p className="dark:text-kg-green2">
                  Remaining: {formatCurrency(allocationSummary.totalIncome - allocationSummary.allocatedIncome)}
                </p>
                
                {/* Income allocation progress bar */}
                {allocationSummary.totalIncome > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-kg-ash/30 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-kg-blue h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (allocationSummary.allocatedIncome / allocationSummary.totalIncome) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-kg-ash">
                      {Math.round((allocationSummary.allocatedIncome / allocationSummary.totalIncome) * 100)}% of income allocated
                    </p>
                  </div>
                )}
              </div>
              
              {/* Bills Panel */}
              <div className="bg-gray-50 dark:bg-kg-ash/10 p-3 rounded">
                <h4 className="font-medium text-gray-700 dark:text-kg-green2 mb-2">Bills</h4>
                <p className="dark:text-kg-green2">Total: {formatCurrency(allocationSummary.totalBills)}</p>
                
                {/* Bill status counts */}
                <div className="flex gap-2 mt-1 mb-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-kg-wine text-white">
                    {allocationSummary.unpaidBillCount} Unpaid
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500 text-gray-800">
                    {allocationSummary.scheduledBillCount} Scheduled
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                    {allocationSummary.paidBillCount} Paid
                  </span>
                </div>
                
                {/* Bill coverage */}
                <p className="dark:text-kg-green2 mt-1">
                  Coverage: {formatCurrency(allocationSummary.allocatedIncome)} / {formatCurrency(allocationSummary.totalBills)}
                  {allocationSummary.totalBills > 0 && (
                    <span className="ml-1">
                      ({Math.round((allocationSummary.allocatedIncome / allocationSummary.totalBills) * 100)}%)
                    </span>
                  )}
                </p>
                
                {/* Bill coverage progress bar */}
                {allocationSummary.totalBills > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-kg-ash/30 rounded-full h-2.5 mb-1">
                      <div 
                        className={`h-2.5 rounded-full ${getProgressBarColor(Math.round((allocationSummary.allocatedIncome / allocationSummary.totalBills) * 100))}`}
                        style={{ width: `${Math.min(100, (allocationSummary.allocatedIncome / allocationSummary.totalBills) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-kg-ash">
                      {Math.round((allocationSummary.allocatedIncome / allocationSummary.totalBills) * 100)}% of bills covered
                    </p>
                  </div>
                )}
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