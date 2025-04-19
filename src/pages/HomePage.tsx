// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

const HomePage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(error => {
        console.error("Error getting initial session in HomePage:", error);
        setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup listener
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The listener above will set session to null, triggering re-render
  };

  if (loading) {
    return <div className="text-center p-4 dark:text-kg-green2">Loading session...</div>;
  }

  if (!session) {
    // If no session, user shouldn't be here. 
    // Later, a Protected Route will handle redirection automatically.
    // For now, we can show a message or return null.
    return <div className="text-center p-4 text-red-600 dark:text-red-400">You must be logged in to view this page.</div>; 
    // Or maybe: navigate('/login'); // Requires useNavigate hook from react-router-dom
  }

  // If session exists, show the welcome content
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
      <p className="mb-2 text-gray-700 dark:text-kg-green2">User ID: {session.user.id}</p>
      <p className="mb-2 text-gray-700 dark:text-kg-green2">Email: {session.user.email}</p>
      <p className="mt-4 text-sm text-gray-500 dark:text-kg-gray">
        (This is where the main application content, like the calendar, will eventually go.)
      </p>
    </div>
  );
};

export default HomePage;