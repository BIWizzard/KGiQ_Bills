// src/components/auth/SignupForm.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { supabase } from '../../lib/supabaseClient';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Add password strength check maybe later

    setLoading(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signupError) {
        setError(`Signup failed: ${signupError.message}`);
        console.error('Signup error:', signupError);
      } else if (data.user?.identities?.length === 0) {
        setError('Signup failed: Unable to create user. The email might already be registered.');
        console.error('Signup issue: User potentially exists but identities array is empty', data);
      } else {
         // Message depends on whether email confirmation is required in Supabase settings
         setMessage('Signup successful! Check your email for a confirmation link if needed.');
      }

    } catch (catchError: any) {
      setError(`An unexpected error occurred: ${catchError.message || 'Unknown error'}`);
      console.error('Unexpected signup error:', catchError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md dark:bg-kg-gray">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-kg-green">
        Create Account
      </h2>
      <form onSubmit={handleSignup}>
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Email Address</label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Password</label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} 
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:border-kg-ash/50 dark:text-kg-green2 dark:placeholder-kg-ash"
            placeholder="•••••••• (min. 6 characters)"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-kg-green2 mb-1">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-kg-blue/50 focus:border-kg-blue dark:bg-kg-ash2/50 dark:text-kg-green2 dark:placeholder-kg-ash ${password !== confirmPassword && confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-kg-ash/50'}`} 
            placeholder="••••••••"
          />
          {password !== confirmPassword && confirmPassword && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Passwords do not match.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (password !== confirmPassword && !!confirmPassword) || !password} 
          className="w-full bg-kg-blue hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-kg-yellow focus:ring-offset-2 dark:focus:ring-offset-kg-gray disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Message/Error Area */}
        {message && !error && (
          <p className="mt-4 text-sm text-center text-kg-green dark:text-kg-green">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">{error}</p>
        )}
      </form>
      
      {/* Link to Login Page */}
       <p className="mt-4 text-center text-sm text-gray-600 dark:text-kg-ash">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-kg-blue hover:underline dark:text-kg-yellow">
            Log In
          </Link>
        </p>
        
    </div>
  );
};

export default SignupForm;