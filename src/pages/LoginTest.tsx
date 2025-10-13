import React, { useState } from 'react';
import { findUserByUsername, getUserProfile } from '../services/database';
import { supabase } from '../config/supabase';

const LoginTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [usernameTest, setUsernameTest] = useState<string>('');

  const testDatabaseConnection = async () => {
    try {
      setTestResult('Testing database connection...');
      const { data: users, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        setTestResult(`❌ Database error: ${error.message}`);
        return;
      }
      
      if (users && users.length > 0) {
        const userCount = users.length;
        const userList = users.map(user => ({
          email: user.email,
          displayName: user.displayName,
          uid: user.uid
        }));
        
        setTestResult(`✅ Database connected! Found ${userCount} users:\n${JSON.stringify(userList, null, 2)}`);
      } else {
        setTestResult('⚠️ Database connected but no users found');
      }
    } catch (error: any) {
      setTestResult(`❌ Database connection failed: ${error.message}`);
    }
  };

  const testUsernameSearch = async () => {
    if (!usernameTest) {
      setTestResult('Please enter a username to test');
      return;
    }

    try {
      setTestResult(`Searching for username: ${usernameTest}...`);
      const userProfile = await findUserByUsername(usernameTest);
      
      if (userProfile) {
        setTestResult(`✅ Username found!\nEmail: ${userProfile.email}\nDisplay Name: ${userProfile.displayName}\nUID: ${userProfile.uid}`);
      } else {
        setTestResult(`❌ Username "${usernameTest}" not found`);
      }
    } catch (error: any) {
      setTestResult(`❌ Username search failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Login Test & Debug</h1>
        
        <div className="space-y-6">
          {/* Database Connection Test */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Database Connection Test</h2>
            <button
              onClick={testDatabaseConnection}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Test Database Connection
            </button>
          </div>

          {/* Username Search Test */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Username Search Test</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={usernameTest}
                onChange={(e) => setUsernameTest(e.target.value)}
                placeholder="Enter username to test"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
              />
              <button
                onClick={testUsernameSearch}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
              >
                Search Username
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
            <pre className="bg-black p-4 rounded text-green-400 font-mono text-sm whitespace-pre-wrap">
              {testResult || 'No tests run yet...'}
            </pre>
          </div>

          {/* Instructions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">How to Fix Login Issues</h2>
            <div className="text-gray-300 space-y-2">
              <p>1. First, test the database connection to see if any users exist</p>
              <p>2. If no users exist, you need to sign up first</p>
              <p>3. If users exist, try searching for your username</p>
              <p>4. Make sure you're using the correct email/username and password</p>
              <p>5. Check the browser console for detailed error messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTest;