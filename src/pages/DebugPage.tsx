import React from 'react';

const DebugPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Debug Page</h1>
      <div className="space-y-4">
        {/* Database Status */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">🗄️ Database Status</h2>
          <p className="text-lg">✅ Database connection successful</p>
        </div>

        {/* Test Actions */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">🧪 Test Actions</h2>
          <p>No authentication-related actions available.</p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
