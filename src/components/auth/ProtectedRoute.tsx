// src/components/auth/ProtectedRoute.tsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Import Navigate for redirection, Outlet for nested routes
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient'; // Adjust path if needed

const ProtectedRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(error => {
        console.error("Error getting initial session in ProtectedRoute:", error);
        setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // No need to set loading here, as it only matters for the initial check
      }
    );

    // Cleanup listener on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // While checking the session, show a loading indicator (optional)
  if (loading) {
    // You might want a more styled loading component later
    return <div className="text-center p-8 dark:text-kg-green2">Checking authentication...</div>;
  }

  // If session exists (user is logged in), render the child route content
  // <Outlet /> is used by React Router to render the nested route component (e.g., HomePage)
  if (session) {
    return <Outlet />;
  }

  // If no session (user is logged out), redirect to the login page
  // `replace` prevents the login page from being added to the history stack
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;