// src/pages/HomePage.tsx (Updated to display CalendarView)
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
// Remove form imports:
// import AddIncomeForm from '../components/forms/AddIncomeForm'; 
// import AddBillForm from '../components/forms/AddBillForm';   
import CalendarView from '../components/calendar/CalendarView'; // <-- 1. Import CalendarView

const HomePage = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserEmail(user?.email);
    };
    fetchUser();
  },[])


  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    // Main container
    <div>
        {/* Box for welcome message */}
        <div className="bg-white p-6 rounded shadow dark:bg-kg-gray mb-6"> 
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-kg-green">
              Welcome! (Home Page)
            </h2>
            <button
              onClick={handleLogout}
              className="bg-kg-wine hover:bg-opacity-90 text-white font-semibold py-1 px-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray"
            >
              Logout
            </button>
          </div>
          {currentUserEmail ? (
             <p className="mb-2 text-gray-700 dark:text-kg-green2">Logged in as: {currentUserEmail}</p>
          ): (
             <p className="mb-2 text-gray-700 dark:text-kg-green2">Loading user info...</p>
          )}
        </div>

        {/* Render the CalendarView instead of the forms */}
        <CalendarView />  {/* <-- 2. Render CalendarView here */}

    </div> 
  );
};

export default HomePage;