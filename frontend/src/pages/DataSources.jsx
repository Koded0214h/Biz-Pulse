import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DataUploader from '../components/DataUploader';

const DataSources = () => {
  return (
    <DashboardLayout activePage="Data Sources">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Sources</h1>
          <p className="text-gray-600">Connect your data sources and upload files for analysis</p>
        </div>

        <DataUploader />

        {/* Connected Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Shopify', connected: true, lastSync: '2 hours ago' },
              { name: 'Stripe', connected: true, lastSync: '1 hour ago' },
              { name: 'Google Analytics', connected: false, lastSync: 'Never' },
              { name: 'QuickBooks', connected: true, lastSync: '5 hours ago' },
              { name: 'Mailchimp', connected: false, lastSync: 'Never' },
              { name: 'Square', connected: false, lastSync: 'Never' }
            ].map((platform, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-800">{platform.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    platform.connected 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {platform.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Last sync: {platform.lastSync}
                </p>
                <button className={`w-full py-2 rounded-lg text-sm font-medium ${
                  platform.connected
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                } transition-colors duration-200`}>
                  {platform.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataSources;