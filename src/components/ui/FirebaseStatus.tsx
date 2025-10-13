import React from 'react';
import { isConfigured } from '../../config/supabase';

const SupabaseStatus: React.FC = () => {
  const configured = isConfigured();

  if (configured) {
    return null; // Don't show anything if Supabase is properly configured
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-900 border border-red-700 rounded-lg p-4 max-w-md">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">🚀</div>
        <div>
          <h4 className="text-white font-bold mb-1">Supabase Setup Required</h4>
          <p className="text-gray-300 text-sm mb-2">
            To use authentication features, please:
          </p>
          <ol className="text-gray-300 text-xs space-y-1 list-decimal list-inside">
            <li>Go to Supabase Dashboard</li>
            <li>Enable Authentication & Create Database</li>
            <li>Update .env with your credentials</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SupabaseStatus;