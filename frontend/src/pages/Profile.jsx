// pages/Profile.jsx
import React, { useState } from 'react';
import Layout from '../components/Layout';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Alex Doe',
    email: 'alex.doe@bizpulse.com',
    notifications: {
      weeklySummary: true,
      criticalAlerts: true,
      productUpdates: false
    }
  });

  const handleSave = async (e) => {
    // Save profile logic here

   e.preventDefault();

   
    console.log('Saving profile:', profile);
    alert('Profile updated successfully!');
  };

  return (
    <Layout activePage="profile">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
        <p className="text-gray-600 mb-8">Update your personal information and profile picture.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">AD</span>
                </div>
                <div className="space-y-2">
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>Upload New Picture</span>
                  </button>
                  <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value="********"
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button className="absolute right-3 top-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
              <div className="space-y-4">
                {Object.entries(profile.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {key === 'weeklySummary' && 'Get a summary of your business performance every week.'}
                        {key === 'criticalAlerts' && 'Receive immediate notifications for critical business events.'}
                        {key === 'productUpdates' && 'Get notified about new features and updates from BizPulse.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: !value }
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Help & Support</h3>
              <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
                <span>Help Center</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button className="w-full border border-red-300 hover:bg-red-50 text-red-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;