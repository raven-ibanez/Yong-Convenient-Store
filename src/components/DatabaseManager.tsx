import React, { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const DatabaseManager: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string>('');
  const { insertBannerSettings } = useSiteSettings();

  const handleInsertBannerSettings = async () => {
    setIsRunning(true);
    setResult('');

    try {
      await insertBannerSettings();
      setResult('✅ Banner settings inserted successfully!');
    } catch (error) {
      setResult('❌ Error: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Database Manager</h2>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Banner Settings Fix</h3>
          <p className="text-sm text-yellow-700 mb-4">
            If the banner toggles are not working, click the button below to insert the missing banner settings into the database.
          </p>
          
          <button
            onClick={handleInsertBannerSettings}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Insert Banner Settings</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.includes('✅') 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              result.includes('✅') ? 'text-green-700' : 'text-red-700'
            }`}>
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;
