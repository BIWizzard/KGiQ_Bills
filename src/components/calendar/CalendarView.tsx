// src/components/calendar/CalendarView.tsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin for the month view

const CalendarView: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow dark:bg-kg-gray">
      <FullCalendar
        plugins={[dayGridPlugin]}       // Load the DayGrid plugin
        initialView="dayGridMonth"    // Set the initial view to month
        headerToolbar={{               // Configure header buttons/title
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay' // Example view switchers (optional)
        }}
        // We'll add event sources, event rendering, and interaction later
        // events={[]} // Example: Empty events array for now
        // eventClick={handleEventClick} // Example: Function to handle clicking an event
        // dateClick={handleDateClick} // Example: Function to handle clicking a date
        height="auto" // Adjust height automatically, or set specific height like "650px"
        // Apply some basic Tailwind styling via className (optional)
        // className="dark:text-kg-green2" // Example - styling might need more specific selectors
      />
    </div>
  );
};

export default CalendarView;