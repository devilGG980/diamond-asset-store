// create-tables.js
// Script to create the users table using Supabase JavaScript client

import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Creating users table...');
console.log('Supabase URL:', supabaseUrl);

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  console.error('Please ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUsersTable() {
  try {
    console.log('Attempting to create users table...');
    
    // Note: The Supabase JavaScript client doesn't support direct table creation
    // We'll need to use the REST API approach or have the user run SQL in the dashboard
    
    console.log('\nUnfortunately, the Supabase JavaScript client cannot directly create tables.');
    console.log('The table creation requires running SQL commands in the Supabase SQL Editor.');
    console.log('\nHere are two options:');
    console.log('\nOption 1 (Recommended):');
    console.log('1. Go to your Supabase dashboard at: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor in the left sidebar');
    console.log('4. Copy and paste the following SQL:');
    console.log(`
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

CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_displayname ON users(displayName);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid()::text = uid);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid()::text = uid);

CREATE POLICY "Users can delete own data"
  ON users
  FOR DELETE
  USING (auth.uid()::text = uid);

GRANT ALL ON TABLE users TO authenticated;`);
    console.log('\n5. Click "Run" to execute the query');
    
    console.log('\nOption 2:');
    console.log('Use the Supabase CLI (if you can install it):');
    console.log('1. Install Supabase CLI: npm install -g supabase');
    console.log('2. Link your project: supabase link --project-ref YOUR_PROJECT_ID');
    console.log('3. Create a migration file with the SQL');
    console.log('4. Apply the migration: supabase db push');
    
    console.log('\nAfter setting up the table, your authentication should work properly!');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the table creation
createUsersTable();