// test-profile-creation.cjs
// Script to test user profile creation directly

const { supabase } = require('./src/config/supabase');

async function testProfileCreation() {
  console.log('Testing user profile creation...');
  
  if (!supabase) {
    console.error('Supabase not configured');
    return;
  }
  
  // Test user data
  const testUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    user_metadata: {
      displayName: 'Test User'
    }
  };
  
  try {
    console.log('Attempting to create test user profile...');
    
    const { error } = await supabase
      .from('users')
      .insert([
        {
          uid: testUser.id,
          email: testUser.email,
          displayName: testUser.user_metadata?.displayName || testUser.email.split('@')[0],
          diamondBalance: 0,
          purchasedAssets: [],
          downloadPurchases: [],
          lastAdWatch: 0,
          adsWatchedToday: 0,
          createdAt: new Date().toISOString()
        }
      ]);
      
    if (error) {
      console.error('Profile creation error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
    } else {
      console.log('✅ Profile created successfully');
      
      // Clean up test record
      console.log('Cleaning up test record...');
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('uid', testUser.id);
        
      if (deleteError) {
        console.error('Cleanup error:', deleteError);
      } else {
        console.log('✅ Test record cleaned up');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testProfileCreation();