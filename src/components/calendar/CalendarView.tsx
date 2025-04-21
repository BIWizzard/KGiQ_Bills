// src/components/calendar/CalendarView.tsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// Import types from FullCalendar
import { EventInput, EventApi, EventHoveringArg, EventClickArg } from '@fullcalendar/core';
import { supabase } from '../../lib/supabaseClient';
import IncomeEventCard from '../cards/IncomeEventCard';
import BillEventCard from '../cards/BillEventCard';
import AllocationModal from '../modals/AllocationModal';
import { getCalendarEventColors, BillStatus, BillEvent, IncomeEvent } from '../../types';

// Import Floating UI hooks and utils
import {
    useFloating,
    FloatingPortal,
    offset,
    flip,
    shift,
} from '@floating-ui/react';

// Define props for the component
interface CalendarViewProps {
    onAllocationChange?: () => void;
}

const CARD_OFFSET = 10;

const CalendarView: React.FC<CalendarViewProps> = ({ onAllocationChange }) => {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State for hover card
    const [hoveredEventData, setHoveredEventData] = useState<EventApi | null>(null);

    // State for allocation modal
    const [isAllocationModalOpen, setIsAllocationModalOpen] = useState<boolean>(false);
    const [selectedBillEvent, setSelectedBillEvent] = useState<BillEvent | null>(null);

    // Setup Floating UI for hover cards
    const { refs, floatingStyles, update } = useFloating({
        placement: 'bottom-start',
        middleware: [ offset(CARD_OFFSET), flip({ padding: 10 }), shift({ padding: 10 }) ],
    });

    // Use React.useMemo to avoid recalculations
    const formatCurrencyMemo = React.useMemo(() => {
        return (amount: number): string => {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
            }).format(amount);
        };
    }, []);

    // Function to get status icon/indicator
    const getStatusIndicator = (status?: string): string => {
        switch (status) {
            case BillStatus.PAID:
                return '✓ '; // Checkmark for paid
            case BillStatus.SCHEDULED:
                return '◑ '; // Half circle for partially paid/scheduled
            case BillStatus.UNPAID:
            default:
                return ''; // No indicator for unpaid
        }
    };

    // Function to fetch events (extracted from useEffect for reusability)
    const fetchEvents = async () => {
        setLoading(true); 
        setError(null);
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
            const userId = user.id;
            
            // Fetch income events
            const { data: incomeData, error: incomeError } = await supabase
                .from('income_events')
                .select('id, source, expected_date, expected_amount, notes')
                .eq('user_id', userId);
            if (incomeError) throw incomeError;
            
            // Fetch bill events with new status and remaining_amount fields
            const { data: billData, error: billError } = await supabase
                .from('bill_events')
                .select('id, payee, due_date, amount_due, description, payment_method, notes, status, remaining_amount')
                .eq('user_id', userId);
            if (billError) throw billError;
            
            // Format events for FullCalendar
            const formattedIncomeEvents: EventInput[] = (incomeData || []).map((event: IncomeEvent) => ({ 
                id: `income-${event.id}`, 
                title: `+${formatCurrencyMemo(event.expected_amount)} (${event.source})`, 
                start: event.expected_date, 
                backgroundColor: '#c5e6a6', 
                borderColor: '#bdd2a6', 
                textColor: '#304c72', 
                extendedProps: { type: 'income', ...event } 
            }));
            
            // Format bill events with status-based colors
            const formattedBillEvents: EventInput[] = (billData || []).map((event: BillEvent) => {
                // Get colors based on status
                const colors = getCalendarEventColors(event.status || BillStatus.UNPAID);
                
                // Create title with status indicator
                const titlePrefix = getStatusIndicator(event.status);
                const title = `${titlePrefix}-${formatCurrencyMemo(event.amount_due)} (${event.payee})`;
                
                return { 
                    id: `bill-${event.id}`, 
                    title: title, 
                    start: event.due_date, 
                    backgroundColor: colors.backgroundColor, 
                    borderColor: colors.borderColor, 
                    textColor: colors.textColor, 
                    extendedProps: { type: 'bill', ...event } 
                };
            });
            
            setEvents([...formattedIncomeEvents, ...formattedBillEvents]);
        } catch (error: unknown) {
            console.error('Error fetching calendar events:', error); 
            let errorMessage = 'An unknown error occurred'; 
            if (error instanceof Error) errorMessage = error.message; 
            else if (typeof error === 'string') errorMessage = error; 
            setError(`Failed to load events: ${errorMessage}`);
        } finally { 
            setLoading(false); 
        }
    };
    
    // Modified useEffect to use the extracted fetchEvents function
    useEffect(() => {
        fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Handlers for hover functionality ---
    const handleMouseEnter = (info: EventHoveringArg) => {
        refs.setReference(info.el);      // Set reference for Floating UI
        setHoveredEventData(info.event); // Set the event data to show
        update();                        // Tell Floating UI to calculate position
    };

    const handleMouseLeave = () => {
        refs.setReference(null);       // Clear reference
        setHoveredEventData(null);     // Clear data to hide card
    };

    // --- Handler for click events (for allocation) ---
    const handleEventClick = (info: EventClickArg) => {
        // Only handle bill events for allocation
        if (info.event.extendedProps?.type === 'bill') {
            // Extract the bill event data from extendedProps
            const billEventData = info.event.extendedProps as BillEvent;
            
            // Only allow allocations for unpaid or partially paid bills
            if (billEventData.status !== BillStatus.PAID) {
                setSelectedBillEvent(billEventData);
                setIsAllocationModalOpen(true);
            } else {
                // Optional: Show a message that paid bills can't receive more allocations
                console.log('This bill is already fully paid.');
            }
        }
        
        // For income events, we could do something else, or nothing
        // e.g., show a different modal with income details
    };

    // Handle allocation modal close
    const handleAllocationModalClose = () => {
        setIsAllocationModalOpen(false);
        setSelectedBillEvent(null);
        
        // After closing the modal, refresh the calendar data
        // to reflect any new allocations
        fetchEvents();
        
        // Call the parent's onAllocationChange callback if provided
        if (onAllocationChange) {
            onAllocationChange();
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-8 rounded shadow dark:bg-kg-gray text-center">
                <p className="text-gray-600 dark:text-kg-green2">Loading calendar events...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-white p-8 rounded shadow dark:bg-kg-gray">
                <div className="text-red-600 dark:text-red-400 mb-4">
                    <p>{error}</p>
                </div>
                <button 
                    onClick={fetchEvents}
                    className="px-4 py-2 bg-kg-blue text-white rounded hover:bg-opacity-90"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded shadow dark:bg-kg-gray">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek' }}
                events={events}
                height="auto"
                eventDisplay="block"
                eventTimeFormat={{ hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' }}
                dayMaxEventRows={true}
                eventClassNames="text-xs px-1 py-0.5 cursor-pointer"

                // --- Use FullCalendar's direct event handlers ---
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                eventClick={handleEventClick} // Add click handler for allocation
            />

            {/* Use FloatingPortal for hover cards */}
            <FloatingPortal>
                {/* Render card only if hoveredEventData exists */}
                {hoveredEventData && (
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className="z-20"
                    >
                        {/* Render correct card */}
                        {hoveredEventData.extendedProps?.type === 'income' && (
                            <IncomeEventCard {...hoveredEventData.extendedProps as IncomeEvent} />
                        )}
                        {hoveredEventData.extendedProps?.type === 'bill' && (
                            <BillEventCard {...hoveredEventData.extendedProps as BillEvent} />
                        )}
                    </div>
                )}
            </FloatingPortal>
            
            {/* Allocation Modal */}
            <AllocationModal 
                isOpen={isAllocationModalOpen}
                onClose={handleAllocationModalClose}
                billEvent={selectedBillEvent}
            />
        </div>
    );
};

export default CalendarView;