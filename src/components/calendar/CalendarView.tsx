// src/components/calendar/CalendarView.tsx (Improved Hover Logic)
import { useState, useEffect, useRef } from 'react'; // Import useRef
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput, EventApi, ViewApi } from '@fullcalendar/core';
import { supabase } from '../../lib/supabaseClient';
import IncomeEventCard from '../cards/IncomeEventCard';
import BillEventCard from '../cards/BillEventCard';

// Interfaces remain the same...
interface IncomeEvent { id: string; source: string; expected_date: string; expected_amount: number; notes?: string | null; }
interface BillEvent { id: string; payee: string; due_date: string; amount_due: number; description?: string | null; payment_method?: string | null; notes?: string | null; }

// Type for hover handler argument
interface EventHoverArg { el: HTMLElement; event: EventApi; jsEvent: MouseEvent; view: ViewApi; }

// Helper function (can move to utils later)
const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// Updated Hover state
interface HoverInfo {
  event: EventApi | null;
  top: number;
  left: number;
}

const CARD_OFFSET = 20; // Increased offset from cursor
const HOVER_DELAY_MS = 150; // Delay before showing card (milliseconds)
const ESTIMATED_CARD_HEIGHT = 150; // Estimate for vertical flipping
const ESTIMATED_CARD_WIDTH = 256; // Estimate based on w-64 class for horizontal flipping

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>({ event: null, top: 0, left: 0 });
  
  // Ref to store the timeout ID for hover delay
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetching logic remains the same...
  useEffect(() => {
    const fetchEvents = async () => {
       setLoading(true); setError(null);
       try { /* ... (same fetching code as before) ... */ 
         const { data: { user }, error: userError } = await supabase.auth.getUser();
         if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
         const userId = user.id;
         const { data: incomeData, error: incomeError } = await supabase.from('income_events').select('id, source, expected_date, expected_amount, notes').eq('user_id', userId);
         if (incomeError) throw incomeError;
         const { data: billData, error: billError } = await supabase.from('bill_events').select('id, payee, due_date, amount_due, description, payment_method, notes').eq('user_id', userId);
         if (billError) throw billError;
         const formattedIncomeEvents: EventInput[] = (incomeData || []).map((event: IncomeEvent) => ({id: `income-${event.id}`, title: `+${formatCurrency(event.expected_amount)} (${event.source})`, start: event.expected_date, backgroundColor: '#c5e6a6', borderColor: '#bdd2a6', textColor: '#304c72', extendedProps: { type: 'income', ...event } }));
         const formattedBillEvents: EventInput[] = (billData || []).map((event: BillEvent) => ({id: `bill-${event.id}`, title: `-${formatCurrency(event.amount_due)} (${event.payee})`, start: event.due_date, backgroundColor: '#733041', borderColor: '#5f2735', textColor: '#ffffff', extendedProps: { type: 'bill', ...event } }));
         setEvents([...formattedIncomeEvents, ...formattedBillEvents]);
       } catch (error: unknown) { 
         console.error('Error fetching calendar events:', error);
         let errorMessage = 'An unknown error occurred';
         if (error instanceof Error) errorMessage = error.message; else if (typeof error === 'string') errorMessage = error; setError(`Failed to load events: ${errorMessage}`);
       } finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

// --- Updated Handlers for Mouse Hover ---
const handleMouseEnter = (info: EventHoverArg) => { 
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      const mouseX = info.jsEvent.clientX;
      const mouseY = info.jsEvent.clientY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newTop = mouseY + CARD_OFFSET;
      let newLeft = mouseX + CARD_OFFSET;

      // --- Vertical Positioning ---
      const spaceBelow = viewportHeight - mouseY - CARD_OFFSET;
      const spaceAbove = mouseY - CARD_OFFSET;

      // If not enough space below, AND there's more space above, position above.
      if (spaceBelow < ESTIMATED_CARD_HEIGHT && spaceAbove > spaceBelow) {
        newTop = mouseY - ESTIMATED_CARD_HEIGHT - CARD_OFFSET;
      }
      // Ensure it doesn't go off the top edge
      if (newTop < 0) {
        newTop = CARD_OFFSET; // Stick to top edge with offset
      }

      // --- Horizontal Positioning ---
      const spaceRight = viewportWidth - mouseX - CARD_OFFSET;
      const spaceLeft = mouseX - CARD_OFFSET;

       // If not enough space right, AND there's more space left, position left.
      if (spaceRight < ESTIMATED_CARD_WIDTH && spaceLeft > spaceRight) {
        newLeft = mouseX - ESTIMATED_CARD_WIDTH - CARD_OFFSET;
      }
       // Ensure it doesn't go off the left edge
      if (newLeft < 0) {
        newLeft = CARD_OFFSET; // Stick to left edge with offset
      }


      setHoverInfo({
        event: info.event,
        top: newTop,
        left: newLeft
      });
    }, HOVER_DELAY_MS); 
  };

  // handleMouseLeave remains the same
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoverInfo({ event: null, top: 0, left: 0 });
  };
  // --- End Handlers ---

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);


  if (loading) { /* ... loading ... */ }
  if (error) { /* ... error ... */ }

  return (
    <div className="relative bg-white p-4 rounded shadow dark:bg-kg-gray">
      <FullCalendar /* ... keep other props ... */
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek' }}
        events={events}
        height="auto"
        eventDisplay="block"
        eventTimeFormat={{ hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' }}
        dayMaxEventRows={true}
        eventClassNames="text-xs px-1 py-0.5 cursor-pointer"
        eventMouseEnter={handleMouseEnter}
        eventMouseLeave={handleMouseLeave}
      />

      {/* Conditionally Render Hover Card */}
      {hoverInfo.event && (
        <div
          className="absolute z-20"
          // Use updated state for positioning
          style={{ left: `${hoverInfo.left}px`, top: `${hoverInfo.top}px` }}
        >
          {hoverInfo.event.extendedProps?.type === 'income' && (
            <IncomeEventCard {...hoverInfo.event.extendedProps as IncomeEvent} />
          )}
          {hoverInfo.event.extendedProps?.type === 'bill' && (
            <BillEventCard {...hoverInfo.event.extendedProps as BillEvent} />
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;