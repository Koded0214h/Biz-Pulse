// pages/DataConnections.jsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../api';

const DataConnections = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);

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
      link:'https://stripe.com/',
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
      link:'https://mailchimp.com/',
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
      link:'https://www.salesforce.com/',
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
      link:'https://www.hubspot.com/',
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
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center space-x-1 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>Connected</span>
          </span>
        );
      case 'syncing':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center space-x-1 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-9-9"/>
            </svg>
            <span>Syncing...</span>
          </span>
        );
      case 'error':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center space-x-1 shadow-sm">
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.json'))) {
      setFile(droppedFile);
      setUploadMessage('');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setUploadMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_id', '1'); // You can generate or manage job IDs as needed

      const data = await authAPI.uploadData(formData);
      setUploadMessage('Upload successful: ' + data.message);
    } catch (error) {
      setUploadMessage('Upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredIntegrations = availableIntegrations.filter(integration => 
    activeCategory === 'all' || integration.category === activeCategory
  );

  return (
    <Layout activePage="connections">
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <polyline points="17.5 11 21.5 11 23 15 20 15"/>
              <polyline points="15.5 15 17.5 15 19 19 17 19"/>
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Data Connections</h1>
          </div>
          <p className="text-gray-600 text-lg">Connect your business platforms or upload files to power BizPulse's insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload & Connected Platforms */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                <span>Upload a File</span>
              </h3>
              <div
                className={`space-y-4 border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={dragOver ? "#3B82F6" : "#9CA3AF"} strokeWidth="2" className="mx-auto">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                  <div>
                    <p className={`text-sm font-medium ${dragOver ? 'text-blue-600' : 'text-gray-600'}`}>
                      {dragOver ? 'Drop the file here' : 'Drag & drop your file here, or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500">Supported formats: CSV, Excel, JSON</p>
                  </div>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".csv,.xlsx,.json"
                  ref={(input) => {
                    if (input) {
                      input.addEventListener('click', (e) => e.stopPropagation());
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Browse files
                </label>
                {file && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 truncate">{file.name}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleFileUpload}
                disabled={uploading || !file}
                className={`w-full mt-4 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  uploading || !file
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                      <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.35 0 0 5.35 0 12s5.35 12 12 12v-8a8 8 0 00-8-8z" />
                    </svg>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Upload to AWS S3'
                )}
              </button>
              {uploadMessage && (
                <p className={`mt-3 text-sm font-medium text-center ${
                  uploadMessage.includes('successful') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {uploadMessage}
                </p>
              )}
            </div>

            {/* Connected Platforms */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                <span>Connected Platforms</span>
              </h3>
              <div className="space-y-4">
                {connectedPlatforms.map((platform, index) => (
                  <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-green-300 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl transition-colors ${
                        platform.status === 'connected' ? 'bg-green-100 text-green-600' :
                        platform.status === 'syncing' ? 'bg-blue-100 text-blue-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{platform.name}</h4>
                        <p className="text-sm text-gray-500">{platform.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(platform.status)}
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 group-hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="12" cy="5" r="1"/>
                          <circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                      <button className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Available Integrations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <polyline points="18 8 24 14 20 20"/>
                    <polyline points="16 21 12 17 8 21"/>
                  </svg>
                  <span>Available Integrations</span>
                </h3>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredIntegrations.map((integration, index) => (
                    <div
                      key={index}
                      className="group border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl text-blue-600 group-hover:scale-110 transition-transform duration-200">
                            {integration.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{integration.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{integration.category}</span>
                        <a href={integration.link} target="_blank" rel="noopener noreferrer">
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                            Connect
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 rounded-b-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-sm text-gray-600">
                    © 2024 BizPulse. All rights reserved.
                  </div>
                  <div className="flex space-x-6 text-sm text-gray-600">
                    <button className="hover:text-blue-600 transition-colors">Support</button>
                    <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
                    <button className="hover:text-blue-600 transition-colors">Terms of Service</button>
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