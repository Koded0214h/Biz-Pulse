// pages/DataConnections.jsx
import React, { useState } from 'react';
import Layout from '../components/Layout';

const DataConnections = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [fileUploading, setFileUploading] = useState(false);

  const connectedPlatforms = [
    {
      name: 'Shopify',
      status: 'connected',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      lastSync: '2 hours ago'
    },
    {
      name: 'QuickBooks',
      status: 'syncing',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
        </svg>
      ),
      lastSync: 'Syncing...'
    },
    {
      name: 'Google Analytics',
      status: 'error',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      lastSync: 'Connection failed'
    }
  ];

  const availableIntegrations = [
    {
      name: 'Stripe',
      category: 'ecommerce',
      description: 'Sync your payment and subscription data.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Analyze your email marketing campaign performance.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    },
    {
      name: 'Salesforce',
      category: 'marketing',
      description: 'Track your sales pipeline and customer interactions.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
          <polyline points="7.5 19.79 7.5 14.6 3 12"/>
          <polyline points="21 12 16.5 14.6 16.5 19.79"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      )
    },
    {
      name: 'HubSpot',
      category: 'marketing',
      description: 'Get insights from your marketing and sales data.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
          <line x1="21.17" y1="8" x2="12" y2="8"/>
          <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
          <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
        </svg>
      )
    }
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'accounting', name: 'Accounting' },
    { id: 'marketing', name: 'Marketing' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center space-x-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>Connected</span>
          </span>
        );
      case 'syncing':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center space-x-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-9-9"/>
            </svg>
            <span>Syncing...</span>
          </span>
        );
      case 'error':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center space-x-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            <span>Error</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleFileUpload = () => {
    setFileUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setFileUploading(false);
      alert('File uploaded successfully!');
    }, 2000);
  };

  const filteredIntegrations = availableIntegrations.filter(integration => 
    activeCategory === 'all' || integration.category === activeCategory
  );

  return (
    <Layout activePage="connections">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Connections</h1>
          <p className="text-gray-600">Connect your business platforms or upload files to power BizPulse's insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload & Connected Platforms */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload a File</h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={handleFileUpload}
              >
                {fileUploading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span className="text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <div className="mt-4">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Add Integration
                      </button>
                      <p className="mt-2 text-sm text-gray-500">CSV, Excel, or JSON files</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Connected Platforms */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Platforms</h3>
              <div className="space-y-4">
                {connectedPlatforms.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        {platform.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{platform.name}</h4>
                        <p className="text-sm text-gray-500">{platform.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(platform.status)}
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="12" cy="5" r="1"/>
                          <circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Available Integrations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Integrations</h3>
                
                {/* Category Filters */}
                <div className="flex space-x-2 mb-6">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIntegrations.map((integration, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {integration.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{integration.name}</h4>
                            <p className="text-sm text-gray-600">{integration.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{integration.category}</span>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-sm text-gray-600">
                    © 2024 BizPulse. All rights reserved.
                  </div>
                  <div className="flex space-x-6 text-sm text-gray-600">
                    <button className="hover:text-gray-800 transition-colors">Support</button>
                    <button className="hover:text-gray-800 transition-colors">Privacy Policy</button>
                    <button className="hover:text-gray-800 transition-colors">Terms of Service</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataConnections;