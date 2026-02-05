// simple-db-test.cjs
// Simple script to test database operations

const { createClient } = require('@supabase/supabase-js');

// Hardcoded credentials from your .env file
const supabaseUrl = 'https://kjxgugitbeickvchonla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeGd1Z2l0YmVpY2t2Y2hvbmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjQ2MTAsImV4cCI6MjA3NjAwMDYxMH0.NYMTtuGDDrpfj70wPg18biJWAgOTiv51iwRi_Z9SX_0';

console.log('Testing Supabase database operations...');
console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileCreation() {
  try {
    console.log('\n1. Testing user profile creation...');
    
    // Test user data
    const testUser = {
      uid: 'test-user-id-' + Date.now(),
      email: 'test@example.com',
      displayName: 'Test User',
      diamondBalance: 0,
      purchasedAssets: [],
      downloadPurchases: [],
      lastAdWatch: 0,
      adsWatchedToday: 0,
      createdAt: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('users')
      .insert([testUser]);
      
    if (error) {
      console.error('Profile creation error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return;
    }
    
    console.log('✅ Profile created successfully');
    
    // Clean up test record
    console.log('\n2. Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('uid', testUser.uid);
      
    if (deleteError) {
      console.error('Cleanup error:', deleteError);
    } else {
      console.log('✅ Test record cleaned up');
    }
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the test
testProfileCreation();