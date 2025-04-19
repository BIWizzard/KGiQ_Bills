// src/App.tsx (Updated with Auth State Handling)
import { useState, useEffect } from 'react'; // Removed 'React,'
import { Session } from '@supabase/supabase-js'; // Import Session type
import { supabase } from './lib/supabaseClient'; // Import our Supabase client
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';

function App() {
  // State to hold the user session information
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    // 1. Check for an existing session when the component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Stop loading once session is checked
    }).catch(error => {
        console.error("Error getting initial session:", error);
        setLoading(false); // Stop loading even if there's an error
    });


    // 2. Listen for changes in authentication state (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Update session state on change
    });

    // 3. Cleanup function: Unsubscribe from the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Optionally show an error message to the user
    } else {
      // Session state will be updated by onAuthStateChange listener
      console.log('Logged out successfully');
    }
  };

  // Show loading indicator while checking initial session
  if (loading) {
      return (
          <Layout>
              <div className="text-center p-8 dark:text-kg-green2">Loading...</div>
          </Layout>
      );
  }


  return (
    <Layout>
      {/* --- Conditionally render based on session --- */}
      {!session ? (
        // If no session (logged out), show the LoginForm
        <LoginForm />
      ) : (
        // If session exists (logged in), show main app content (placeholder for now)
        <div className="bg-white p-6 rounded shadow dark:bg-kg-gray">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-kg-green">
              Welcome! You are logged in.
            </h2>
            <button
              onClick={handleLogout}
              className="bg-kg-wine hover:bg-opacity-90 text-white font-semibold py-1 px-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray"
            >
              Logout
            </button>
          </div>
          <p className="mb-2 text-gray-700 dark:text-kg-green2">Your User ID is: {session.user.id}</p>
          <p className="mb-2 text-gray-700 dark:text-kg-green2">Your Email is: {session.user.email}</p>
          <p className="mt-4 text-sm text-gray-500 dark:text-kg-gray">
            (This is where the main application content, like the calendar, will go eventually.)
          </p>
        </div>
      )}
      {/* --- End Content --- */}
    </Layout>
  );
}

export default App;