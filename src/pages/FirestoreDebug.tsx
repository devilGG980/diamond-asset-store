import React, { useState } from 'react';
import { testFirestoreConnection, createFirestoreUserProfile, getFirestoreUserProfile } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';

const FirestoreDebug: React.FC = () => {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    addResult('Testing Firestore connection...');
    try {
      const isConnected = await testFirestoreConnection();
      addResult(isConnected ? '✅ Connection successful' : '❌ Connection failed');
    } catch (error: any) {
      addResult(`❌ Connection error: ${error.message}`);
    }
  };

  const testCreateProfile = async () => {
    if (!currentUser) {
      addResult('❌ No user logged in');
      return;
    }

    addResult('Testing profile creation...');
    try {
      await createFirestoreUserProfile(currentUser);
      addResult('✅ Profile creation successful');
    } catch (error: any) {
      addResult(`❌ Profile creation error: ${error.message}`);
    }
  };

  const testGetProfile = async () => {
    if (!currentUser) {
      addResult('❌ No user logged in');
      return;
    }

    addResult('Testing profile retrieval...');
    try {
      const profile = await getFirestoreUserProfile(currentUser.uid);
      addResult(profile ? `✅ Profile found: ${JSON.stringify(profile)}` : '⚠️ No profile found');
    } catch (error: any) {
      addResult(`❌ Profile retrieval error: ${error.message}`);
    }
  };

  const createSimpleProfile = async () => {
    if (!currentUser) {
      addResult('❌ No user logged in');
      return;
    }

    addResult('Creating simple profile manually...');
    try {
      // Import Firestore functions directly
      const { doc, setDoc } = await import('firebase/firestore');
      const { firestore } = await import('../register');
      
      const userRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userRef, {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || currentUser.email?.split('@')[0],
        diamondBalance: 0,
        purchasedAssets: [],
        adsWatchedToday: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      addResult('✅ Simple profile created successfully');
    } catch (error: any) {
      addResult(`❌ Simple profile creation error: ${error.message}`);
      addResult(`Error code: ${error.code}`);
      addResult(`Error details: ${JSON.stringify(error)}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">🔧 Firestore Debug Panel</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Buttons */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Manual Tests</h2>
            <div className="space-y-4">
              <button
                onClick={testConnection}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium"
              >
                Test Firestore Connection
              </button>
              
              <button
                onClick={testCreateProfile}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-medium"
                disabled={!currentUser}
              >
                Create User Profile
              </button>
              
              <button
                onClick={testGetProfile}
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-medium"
                disabled={!currentUser}
              >
                Get User Profile
              </button>
              
              <button
                onClick={createSimpleProfile}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white font-medium"
                disabled={!currentUser}
              >
                Create Simple Profile
              </button>
              
              <button
                onClick={clearResults}
                className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-medium"
              >
                Clear Results
              </button>
            </div>
            
            <div className="mt-4 text-sm">
              <p>Current User: {currentUser ? currentUser.email : 'Not logged in'}</p>
              <p>User ID: {currentUser ? currentUser.uid : 'N/A'}</p>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <div className="bg-black p-4 rounded min-h-[300px] max-h-[500px] overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-400">No tests run yet. Click a test button to start.</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm mb-2 font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">🚨 Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>First, <strong>login or signup</strong> with an account</li>
            <li>Click <strong>"Test Firestore Connection"</strong> - should show ✅</li>
            <li>Click <strong>"Create Simple Profile"</strong> (yellow button) - should show ✅</li>
            <li>Click <strong>"Get User Profile"</strong> - should show profile data</li>
            <li>Check <strong>Firebase Console</strong> for the "users" collection</li>
            <li>If still not working, manually create collection in Firebase Console</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-900 rounded">
            <p className="text-yellow-200">
              <strong>Common Issues:</strong><br/>
              • "Permission denied" = Firestore rules too strict<br/>
              • "Failed precondition" = Firestore not created properly<br/>
              • "Network error" = Internet/Firebase connection issue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreDebug;