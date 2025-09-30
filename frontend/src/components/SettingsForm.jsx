import React, { useState } from 'react';
import { FiBell, FiSliders, FiUser, FiSave } from 'react-icons/fi';

const SettingsForm = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailDigest: true,
      anomalyAlerts: true,
      weeklyReports: true,
      productUpdates: false
    },
    thresholds: {
      salesDrop: 15,
      revenueSpike: 25,
      inventoryLow: 10,
      customerChurn: 5
    },
    preferences: {
      timezone: 'EST',
      currency: 'USD',
      language: 'English'
    }
  });

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleThresholdChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: parseInt(value)
      }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Settings & Preferences</h3>

      <div className="space-y-8">
        {/* Notifications */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FiBell className="w-5 h-5 text-teal-500" />
            <h4 className="text-lg font-medium text-gray-800">Notifications</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FiSliders className="w-5 h-5 text-orange-500" />
            <h4 className="text-lg font-medium text-gray-800">Alert Thresholds</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.thresholds).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()} (%)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={value}
                    onChange={(e) => handleThresholdChange(key, e.target.value)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-12 text-center font-medium text-gray-700">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FiUser className="w-5 h-5 text-blue-500" />
            <h4 className="text-lg font-medium text-gray-800">Preferences</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option>EST</option>
                <option>PST</option>
                <option>CST</option>
                <option>GMT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>CAD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">
            <FiSave className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;