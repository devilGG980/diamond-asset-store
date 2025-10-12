import React, { useEffect, useState } from 'react';
import { auth, db } from '../register';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

const DebugPage: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [dbStatus, setDbStatus] = useState<string>('Checking...');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Test Authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStatus('✅ User is logged in');
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      } else {
        setAuthStatus('❌ No user logged in');
        setCurrentUser(null);
      }
    });

    // Test Database Connection
    const testDatabase = async () => {
      try {
        const dbRef = ref(db, '/');
        const snapshot = await get(dbRef);
        setDbStatus('✅ Database connection successful');
        console.log('Database data:', snapshot.val());
      } catch (error) {
        setDbStatus(`❌ Database error: ${error}`);
        console.error('Database error:', error);
      }
    };

    testDatabase();

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Firebase Debug Page</h1>
        
        <div className="grid gap-6">
          {/* Firebase Config Status */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">🔥 Firebase Configuration</h2>
            <div className="space-y-2">
              <p><strong>Project ID:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Auth Domain:</strong> videoforges.firebaseapp.com</p>
              <p><strong>Database URL:</strong> https://videoforges-default-rtdb.asia-southeast1.firebasedatabase.app/</p>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">🔐 Authentication Status</h2>
            <p className="text-lg mb-4">{authStatus}</p>
            {currentUser && (
              <div className="bg-gray-800 p-4 rounded">
                <p><strong>UID:</strong> {currentUser.uid}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</p>
              </div>
            )}
          </div>

          {/* Database Status */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">🗄️ Database Status</h2>
            <p className="text-lg">{dbStatus}</p>
          </div>

          {/* Test Actions */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">🧪 Test Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '/login'}
                className="btn-primary mr-4"
              >
                Go to Login
              </button>
              <button 
                onClick={() => window.location.href = '/signup'}
                className="btn-secondary mr-4"
              >
                Go to Signup
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="btn-secondary"
              >
                Try Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;