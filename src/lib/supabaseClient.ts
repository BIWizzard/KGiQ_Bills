import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
// Vite exposes env variables prefixed with VITE_ on `import.meta.env`
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Runtime check to ensure the variables are loaded correctly
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and/or Anon Key are missing in .env file. Ensure they start with VITE_");
}

// Create and export the Supabase client instance
// This allows us to import this configured client anywhere in our app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Note: Later, we can enhance this by adding type definitions for our database 
// using Supabase CLI `supabase gen types typescript > src/lib/database.types.ts` 
// and then using:
// import { Database } from './database.types'; // Adjust path as needed
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);