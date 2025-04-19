// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Import our Supabase client

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setMessage(''); // Clear previous messages
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setMessage(`Login failed: ${error.message}`);
        console.error('Login error:', error);
      } else {
        setMessage('Login successful! Redirecting...');
        // TODO: Handle successful login (e.g., redirect, update app state)
        // For now, we just log success
        console.log('Login successful');
      }
    } catch (error: any) {
      setMessage(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
      console.error('Unexpected login error:', error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    // Using dark:bg-kg-gray as discussed for content boxes
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md dark:bg-kg-gray">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-kg-green">
        Login
      </h2>
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          // Using kg-blue for button, yellow accent on hover/focus
          className="w-full bg-kg-blue hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Message Area */}
        {message && (
          <p className={`mt-4 text-sm text-center ${message.includes('failed') || message.includes('error') ? 'text-red-600 dark:text-red-400' : 'text-kg-green dark:text-kg-green'}`}>
            {message}
          </p>
        )}
      </form>
      {/* TODO: Add links for Signup / Password Reset later */}
    </div>
  );
};

export default LoginForm;