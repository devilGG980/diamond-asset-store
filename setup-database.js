// setup-database.js
// Script to automatically set up the required database tables in Supabase

import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Setting up database tables...');
console.log('Supabase URL:', supabaseUrl);

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  console.error('Please ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client with service role key (needed for admin operations)
// Note: For this script, you'll need to use the service role key instead of anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL to create the users table
const setupSQL = `
-- Create users table for Diamond Assets Store
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  displayName TEXT,
  diamondBalance INTEGER DEFAULT 0,
  purchasedAssets TEXT[] DEFAULT '{}',
  downloadPurchases JSONB DEFAULT '[]',
  lastAdWatch BIGINT,
  adsWatchedToday INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_displayname ON users(displayName);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create security policies
-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid()::text = uid);

-- Policy: Users can insert their own data (for profile creation)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid()::text = uid);

-- Policy: Users can delete their own data
CREATE POLICY "Users can delete own data"
  ON users
  FOR DELETE
  USING (auth.uid()::text = uid);

-- Grant necessary permissions
GRANT ALL ON TABLE users TO authenticated;
`;

async function setupDatabase() {
  try {
    console.log('Executing database setup SQL...');
    
    // Note: Supabase JavaScript client doesn't support raw SQL execution
    // For this, you would need to use the Supabase CLI or make direct API calls
    console.log('Note: The Supabase JavaScript client does not support raw SQL execution.');
    console.log('Please use the Supabase CLI or execute the SQL in the Supabase dashboard.');
    console.log('\nTo set up the database table, please:');
    console.log('1. Go to your Supabase dashboard at: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the following SQL:');
    console.log('\n' + setupSQL);
    console.log('\n5. Click "Run" to execute the query');
    
  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();