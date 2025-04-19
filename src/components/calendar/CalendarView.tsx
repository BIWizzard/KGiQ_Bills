// src/components/calendar/CalendarView.tsx (Simplified Floating UI + FC Event Props)
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// Import types from FullCalendar - EventApi is key, EventHoveringArg might be useful again
import { EventInput, EventApi, EventHoveringArg } from '@fullcalendar/core';
import { supabase } from '../../lib/supabaseClient';
import IncomeEventCard from '../cards/IncomeEventCard';
import BillEventCard from '../cards/BillEventCard';

// Import Floating UI hooks and utils - JUST useFloating and Portal now
import {
    useFloating,
    FloatingPortal,
    offset,
    flip,
    shift,
} from '@floating-ui/react';

// Interfaces for Supabase data
interface IncomeEvent { id: string; source: string; expected_date: string; expected_amount: number; notes?: string | null; }
interface BillEvent { id: string; payee: string; due_date: string; amount_due: number; description?: string | null; payment_method?: string | null; notes?: string | null; }

// Helper function
const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const CARD_OFFSET = 10;

const CalendarView: React.FC = () => {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State for hover card - simplified
    const [hoveredEventData, setHoveredEventData] = useState<EventApi | null>(null);

    // Setup Floating UI - simplified: no open state management needed here
    const { refs, floatingStyles, update } = useFloating({
        // Keep placement and middleware
        placement: 'bottom-start',
        middleware: [ offset(CARD_OFFSET), flip({ padding: 10 }), shift({ padding: 10 }) ],
        // Remove open/onOpenChange - we control via hoveredEventData
        // whileElementsMounted: autoUpdate, // Option for auto-updates if needed
    });

    // Fetching logic remains the same...
    useEffect(() => {
        const fetchEvents = async () => {
           setLoading(true); setError(null);
           try {
               /* ... (same fetching code as before) ... */
               const { data: { user }, error: userError } = await supabase.auth.getUser();
               if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
               const userId = user.id;
               const { data: incomeData, error: incomeError } = await supabase.from('income_events').select('id, source, expected_date, expected_amount, notes').eq('user_id', userId);
               if (incomeError) throw incomeError;
               const { data: billData, error: billError } = await supabase.from('bill_events').select('id, payee, due_date, amount_due, description, payment_method, notes').eq('user_id', userId);
               if (billError) throw billError;
               const formattedIncomeEvents: EventInput[] = (incomeData || []).map((event: IncomeEvent) => ({ id: `income-${event.id}`, title: `+${formatCurrency(event.expected_amount)} (${event.source})`, start: event.expected_date, backgroundColor: '#c5e6a6', borderColor: '#bdd2a6', textColor: '#304c72', extendedProps: { type: 'income', ...event } }));
               const formattedBillEvents: EventInput[] = (billData || []).map((event: BillEvent) => ({ id: `bill-${event.id}`, title: `-${formatCurrency(event.amount_due)} (${event.payee})`, start: event.due_date, backgroundColor: '#733041', borderColor: '#5f2735', textColor: '#ffffff', extendedProps: { type: 'bill', ...event } }));
               setEvents([...formattedIncomeEvents, ...formattedBillEvents]);
           } catch (error: unknown) {
               console.error('Error fetching calendar events:', error); let errorMessage = 'An unknown error occurred'; if (error instanceof Error) errorMessage = error.message; else if (typeof error === 'string') errorMessage = error; setError(`Failed to load events: ${errorMessage}`);
           } finally { setLoading(false); }
        };
        fetchEvents();
    }, []);


    // --- Handlers using FullCalendar Props ---
    const handleMouseEnter = (info: EventHoveringArg) => { // Use EventHoveringArg type again
        refs.setReference(info.el);      // Set reference for Floating UI
        setHoveredEventData(info.event); // Set the event data to show
        update();                        // Tell Floating UI to calculate position
    };

    const handleMouseLeave = () => {
        refs.setReference(null);       // Clear reference
        setHoveredEventData(null);     // Clear data to hide card
    };
    // --- End Handlers ---


    if (loading) { /* ... loading ... */ }
    if (error) { /* ... error ... */ }

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
            />

            {/* Use FloatingPortal */}
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
        </div>
    );
};

export default CalendarView;