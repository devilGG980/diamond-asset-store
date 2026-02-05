// test-db-simple.js
// Simple script to test if the users table exists

import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials from your .env file
const supabaseUrl = 'https://kjxgugitbeickvchonla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeGd1Z2l0YmVpY2t2Y2hvbmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjQ2MTAsImV4cCI6MjA3NjAwMDYxMH0.NYMTtuGDDrpfj70wPg18biJWAgOTiv51iwRi_Z9SX_0';

console.log('Testing Supabase database connection...');
console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  try {
    console.log('\n1. Testing connection to Supabase...');
    
    // Test basic connection by trying to access the users table
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('Database connection error:', error.message);
      console.error('Error code:', error.code);
      
      if (error.code === '42P01') {
        console.error('\n❌ TABLE NOT FOUND ERROR');
        console.error('The "users" table does not exist in your Supabase database.');
        console.error('\nTo fix this issue:');
        console.error('1. Go to your Supabase dashboard at: https://app.supabase.com');
        console.error('2. Select your project');
        console.error('3. Go to SQL Editor in the left sidebar');
        console.error('4. Copy and paste the following SQL:');
        console.error(`
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
        console.error('\n5. Click "Run" to execute the query');
      } else {
        console.error('\nUnknown error. Please check your Supabase configuration.');
      }
      return;
    }
    
    console.log('✅ Connection successful');
    console.log('✅ Users table exists and is accessible');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the test
testDatabase();