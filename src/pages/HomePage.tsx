// src/pages/HomePage.tsx (Simplified)
import { useEffect, useState } from 'react'; // Keep useState if needed for other page state
import { supabase } from '../lib/supabaseClient';

const HomePage = () => {
  // We get the session info directly now, assuming ProtectedRoute ensures it exists
  // We might fetch session again or use a context later if needed for display
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch user email on component mount (since we know we are logged in)
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserEmail(user?.email);
    };
    fetchUser();
  },[])


  const handleLogout = async () => {
    await supabase.auth.signOut();
    // No need to set session state here, ProtectedRoute will redirect
  };

  // No need for loading or !session checks here anymore

  return (
    <div className="bg-white p-6 rounded shadow dark:bg-kg-gray">
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

      <p className="mt-4 text-sm text-gray-500 dark:text-kg-gray">
        (The main application content, like the calendar, goes here.)
      </p>
    </div>
  );
};

export default HomePage;