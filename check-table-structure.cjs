// check-table-structure.cjs
// Script to check the users table structure

const { createClient } = require('@supabase/supabase-js');

// Hardcoded credentials from your .env file
const supabaseUrl = 'https://kjxgugitbeickvchonla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeGd1Z2l0YmVpY2t2Y2hvbmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjQ2MTAsImV4cCI6MjA3NjAwMDYxMH0.NYMTtuGDDrpfj70wPg18biJWAgOTiv51iwRi_Z9SX_0';

console.log('Checking users table structure...');
console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableStructure() {
  try {
    console.log('\n1. Getting table info...');
    
    // Get table information
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Table query error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return;
    }
    
    console.log('✅ Table query successful');
    console.log('Sample data:', JSON.stringify(data, null, 2));
    
    console.log('\n2. Checking specific columns...');
    
    // Try to query specific columns
    const requiredColumns = [
      'uid',
      'email',
      'displayName',
      'diamondBalance',
      'purchasedAssets',
      'downloadPurchases',
      'lastAdWatch',
      'adsWatchedToday',
      'createdAt'
    ];
    
    for (const column of requiredColumns) {
      try {
        const { data: columnData, error: columnError } = await supabase
          .from('users')
          .select(column)
          .limit(1);
          
        if (columnError) {
          console.error(`❌ Column '${column}' error:`, columnError.message);
        } else {
          console.log(`✅ Column '${column}' exists`);
        }
      } catch (err) {
        console.error(`❌ Column '${column}' error:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the check
checkTableStructure();