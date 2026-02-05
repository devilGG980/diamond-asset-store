// simple-table-check.cjs
// Simple script to check what's in the users table

const { createClient } = require('@supabase/supabase-js');

// Hardcoded credentials from your .env file
const supabaseUrl = 'https://kjxgugitbeickvchonla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeGd1Z2l0YmVpY2t2Y2hvbmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjQ2MTAsImV4cCI6MjA3NjAwMDYxMH0.NYMTtuGDDrpfj70wPg18biJWAgOTiv51iwRi_Z9SX_0';

console.log('Simple users table check...');
console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function simpleCheck() {
  try {
    console.log('\n1. Checking if table exists by querying count...');
    
    // Try a simple count query
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Count query error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return;
    }
    
    console.log('✅ Count query successful');
    console.log('Number of rows in users table:', count);
    
    console.log('\n2. Trying to insert a simple test record...');
    
    // Try to insert a minimal record
    const testData = {
      uid: 'test-' + Date.now(),
      email: 'test@example.com'
    };
    
    const { error: insertError } = await supabase
      .from('users')
      .insert([testData]);
      
    if (insertError) {
      console.error('Insert error:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
    } else {
      console.log('✅ Insert successful');
      
      // Clean up
      await supabase
        .from('users')
        .delete()
        .eq('uid', testData.uid);
        
      console.log('✅ Test record cleaned up');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the check
simpleCheck();