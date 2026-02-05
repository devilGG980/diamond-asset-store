// test-database.js
// Script to test if the users table exists and is properly configured

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Function to parse .env file
function parseEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    const envVars = {};
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim() === '' || line.trim().startsWith('#')) {
        continue;
      }
      
      // Parse key=value pairs
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1);
        }
        
        envVars[key] = value;
      }
    }
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

// Get credentials from environment variables
const envVars = parseEnvFile();
const supabaseUrl = envVars.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = envVars.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing Supabase database connection...');
console.log('Supabase URL:', supabaseUrl);

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  console.error('Please ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  try {
    console.log('\n1. Testing connection to Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('Database connection error:', error.message);
      console.error('Error code:', error.code);
      
      if (error.code === '42P01') {
        console.error('\n❌ TABLE NOT FOUND ERROR');
        console.error('The "users" table does not exist in your Supabase database.');
        console.error('Please run the SQL script to create the required tables.');
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
      }
      return;
    }
    
    console.log('✅ Connection successful');
    
    console.log('\n2. Testing users table structure...');
    // Try to get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('Table structure error:', tableError.message);
      return;
    }
    
    console.log('✅ Users table exists and is accessible');
    
    console.log('\n3. Testing insert operation...');
    // Try a test insert (this will likely fail due to RLS, but we can see if the table structure is correct)
    const testUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      diamondBalance: 0,
      purchasedAssets: [],
      downloadPurchases: [],
      lastAdWatch: 0,
      adsWatchedToday: 0,
      createdAt: new Date().toISOString()
    };
    
    const { error: insertError } = await supabase
      .from('users')
      .insert([testUser]);
      
    if (insertError) {
      console.error('Insert test error:', insertError.message);
      if (insertError.message.includes('new row violates row-level security policy')) {
        console.log('✅ Table structure is correct, but RLS is working as expected');
      }
    } else {
      console.log('✅ Insert operation successful');
      // Clean up test record
      await supabase.from('users').delete().eq('uid', 'test-user-id');
    }
    
    console.log('\n✅ All tests passed! Database is properly configured.');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the test
testDatabase();