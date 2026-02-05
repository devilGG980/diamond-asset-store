// fix-users-table.cjs
// Script to fix the users table structure

const { createClient } = require('@supabase/supabase-js');

// Hardcoded credentials from your .env file
const supabaseUrl = 'https://kjxgugitbeickvchonla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeGd1Z2l0YmVpY2t2Y2hvbmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjQ2MTAsImV4cCI6MjA3NjAwMDYxMH0.NYMTtuGDDrpfj70wPg18biJWAgOTiv51iwRi_Z9SX_0';

console.log('Fixing users table structure...');
console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUsersTable() {
  try {
    console.log('\n1. Checking current table structure...');
    
    // First, let's see if we can query the table at all
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Count query error:', countError.message);
    } else {
      console.log('✅ Users table exists with', count, 'rows');
    }
    
    console.log('\n2. IMPORTANT: You need to run the following SQL in your Supabase dashboard:');
    console.log('\n--- COPY THE FOLLOWING SQL TO YOUR SUPABASE SQL EDITOR ---\n');
    
    console.log(`
-- Drop the existing users table (WARNING: This will delete all data!)
DROP TABLE IF EXISTS users;

-- Create users table with correct structure
CREATE TABLE users (
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
CREATE INDEX idx_users_uid ON users(uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_displayname ON users(displayName);

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

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
`);
    
    console.log('\n--- END OF SQL ---\n');
    console.log('Steps to fix the issue:');
    console.log('1. Go to your Supabase dashboard at: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor in the left sidebar');
    console.log('4. Copy and paste the SQL above');
    console.log('5. Click "Run" to execute the query');
    console.log('6. After running, restart your application');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the fix
fixUsersTable();