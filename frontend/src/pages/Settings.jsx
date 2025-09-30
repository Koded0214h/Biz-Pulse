import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SettingsForm from '../components/SettingsForm';

const Settings = () => {
  return (
    <DashboardLayout activePage="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your preferences and notification settings</p>
        </div>

        <SettingsForm />
      </div>
    </DashboardLayout>
  );
};

export default Settings;