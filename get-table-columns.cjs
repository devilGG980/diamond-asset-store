// get-table-columns.cjs
// Script to get the actual table columns

const { createClient } = require('@supabase/supabase-js');

// Hardcoded credentials from your .env file
const supabaseUrl = 'https://kjxgugitbeickvchonla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeGd1Z2l0YmVpY2t2Y2hvbmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjQ2MTAsImV4cCI6MjA3NjAwMDYxMH0.NYMTtuGDDrpfj70wPg18biJWAgOTiv51iwRi_Z9SX_0';

console.log('Getting actual users table columns...');
console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getTableColumns() {
  try {
    console.log('\nGetting table columns from information_schema...');
    
    // Query the information schema to get column names
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'users')
      .order('ordinal_position');
      
    if (error) {
      console.error('Query error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return;
    }
    
    console.log('✅ Query successful');
    console.log('Actual columns in users table:');
    data.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the check
getTableColumns();