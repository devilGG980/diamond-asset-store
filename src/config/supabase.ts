// Supabase Configuration
// Replace Firebase with Supabase for authentication and database

import { createClient } from '@supabase/supabase-js';

// Supabase project configuration
// Get these values from your Supabase project dashboard at https://app.supabase.com
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Instructions for getting Supabase configuration:
/*
1. Go to https://app.supabase.com
2. Create a new project or select existing project
3. Go to Project Settings (gear icon) > API
4. Copy the following values:
   - Project URL -> REACT_APP_SUPABASE_URL
   - anon/public key -> REACT_APP_SUPABASE_ANON_KEY
5. Create a .env file in the project root with:
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key

Example .env file:
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*/

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const isUserSignedIn = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};

// Configuration status check
export const isConfigured = (): boolean => {
  return supabaseUrl !== 'YOUR_SUPABASE_URL' && 
         supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
         supabaseUrl.includes('supabase.co');
};

// Development helper - logs configuration status
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase Configuration Status:', {
    configured: isConfigured(),
    url: supabaseUrl.includes('supabase.co') ? '✅ Valid URL' : '❌ Invalid URL',
    key: supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' ? '✅ Key set' : '❌ Key not set'
  });
  
  if (!isConfigured()) {
    console.warn(`
🚀 SUPABASE SETUP REQUIRED 🚀

Your Supabase configuration is not set up yet. Please:

1. Go to https://app.supabase.com
2. Create a new project called "Diamond Assets Store"
3. Enable Authentication (Email/Password and OAuth providers)
4. Create database tables (see SUPABASE_SETUP.md)
5. Copy your Project URL and anon key from Settings > API
6. Create a .env file with:
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key

Current config status: NOT CONFIGURED
    `);
  }
}

export default supabase;
