import React, { useState } from 'react';
import { ref, set, push, serverTimestamp } from 'firebase/database';
import { db } from '../register';
import toast from 'react-hot-toast';

const DatabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const saveTestData = async () => {
    setLoading(true);
    setTestResult('Testing database connection...');
    
    try {
      // Test 1: Save a simple test object
      const testRef = ref(db, 'test/simple');
      await set(testRef, {
        message: 'Hello from Diamond Assets Store!',
        timestamp: Date.now(),
        serverTime: serverTimestamp(),
        testNumber: Math.floor(Math.random() * 1000)
      });
      
      setTestResult(prev => prev + '\n✅ Simple test data saved successfully!');
      
      // Test 2: Push a new test entry (generates unique ID)
      const testEntriesRef = ref(db, 'test/entries');
      const newEntryRef = push(testEntriesRef);
      await set(newEntryRef, {
        type: 'test_entry',
        message: 'This is a pushed entry with unique ID',
        created: serverTimestamp(),
        id: newEntryRef.key
      });
      
      setTestResult(prev => prev + '\n✅ Push test data saved successfully!');
      
      // Test 3: Save a test user profile
      const testUserId = 'test-user-' + Date.now();
      const userRef = ref(db, `users/${testUserId}`);
      await set(userRef, {
        uid: testUserId,
        email: 'test@example.com',
        displayName: 'Test User',
        diamondBalance: 100,
        purchasedAssets: [],
        adsWatchedToday: 0,
        createdAt: Date.now(),
        testAccount: true
      });
      
      setTestResult(prev => prev + '\n✅ Test user profile saved successfully!');
      
      // Test 4: Save current timestamp
      const timestampRef = ref(db, 'test/lastTest');
      await set(timestampRef, {
        lastTestRun: serverTimestamp(),
        testBy: 'Database Test Page',
        browserInfo: navigator.userAgent
      });
      
      setTestResult(prev => prev + '\n✅ Timestamp data saved successfully!');
      setTestResult(prev => prev + '\n\n🎉 ALL TESTS PASSED! Database is working perfectly!');
      
      toast.success('🎉 Database test completed successfully!');
      
    } catch (error: any) {
      console.error('Database test error:', error);
      setTestResult(prev => prev + '\n❌ Error: ' + error.message);
      toast.error('❌ Database test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearTestData = async () => {
    setLoading(true);
    try {
      // Clear test data
      const testRef = ref(db, 'test');
      await set(testRef, null);
      setTestResult('✅ Test data cleared from database');
      toast.success('Test data cleared');
    } catch (error: any) {
      setTestResult('❌ Error clearing data: ' + error.message);
      toast.error('Error clearing data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">🧪 Realtime Database Test</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Test Controls</h2>
            <div className="space-y-4">
              <button
                onClick={saveTestData}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-3 rounded text-white font-medium transition-colors"
              >
                {loading ? 'Testing...' : '🚀 Run Database Test'}
              </button>
              
              <button
                onClick={clearTestData}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-3 rounded text-white font-medium transition-colors"
              >
                {loading ? 'Clearing...' : '🗑️ Clear Test Data'}
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
              <p><strong>What this test does:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Saves a simple test object</li>
                <li>Pushes data with auto-generated ID</li>
                <li>Creates a test user profile</li>
                <li>Saves timestamp data</li>
              </ul>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <div className="bg-black p-4 rounded min-h-[300px] max-h-[400px] overflow-y-auto">
              {testResult ? (
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {testResult}
                </pre>
              ) : (
                <p className="text-gray-400">Click "Run Database Test" to start testing...</p>
              )}
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">📊 Database Information</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-yellow-400 mb-2">Test Locations:</h4>
              <ul className="space-y-1 text-gray-300">
                <li><code>/test/simple</code> - Simple test data</li>
                <li><code>/test/entries/</code> - Pushed entries with unique IDs</li>
                <li><code>/users/test-user-[timestamp]</code> - Test user profile</li>
                <li><code>/test/lastTest</code> - Last test timestamp</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-yellow-400 mb-2">Check Your Database:</h4>
              <p className="text-gray-300 mb-2">
                Go to Firebase Console to verify data was saved:
              </p>
              <a 
                href="https://console.firebase.google.com/project/videoforges/database/videoforges-default-rtdb/data"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                🔗 Open Firebase Realtime Database
              </a>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900 text-blue-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">🔍 How to Verify:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the "🚀 Run Database Test" button above</li>
            <li>Wait for all tests to complete</li>
            <li>Open the Firebase Console link above</li>
            <li>Look for the "test" node in your database</li>
            <li>Expand it to see all the saved test data</li>
            <li>If you see the data, your database is working perfectly! ✅</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;