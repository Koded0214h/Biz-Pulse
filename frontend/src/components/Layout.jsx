// components/Layout.jsx
import React from 'react';

const Layout = ({ children, activePage }) => {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 29" fill="none" stroke="white" strokeWidth="2" >
              <path d="M21 12h-8l-3-3-3 3H3a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Z"/>
              <path d="m6 12 4-4 4 4"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">BizPulse</h1>
        </div>
        
<nav className="space-y-2">
  <SidebarItem 
    icon="dashboard" 
    label="Dashboard" 
    active={activePage === 'dashboard'} 
    onClick={() => window.location.href = '/dashboard'}
  />
  <SidebarItem 
    icon="sales" 
    label="Sales" 
    active={activePage === 'sales'} 
    onClick={() => window.location.href = '/sales'}
  />
    <SidebarItem 
    icon="connections" 
    label="Data Connections" 
    active={activePage === 'connections'} 
    onClick={() => window.location.href = '/connections'}
  />
  <SidebarItem 
    icon="alert" 
    label="Alerts" 
    active={activePage === 'alerts'} 
    onClick={() => window.location.href = '/alerts'}
  />
  <SidebarItem 
    icon="settings" 
    label="Profile" 
    active={activePage === 'profile'} 
    onClick={() => window.location.href = '/profile'}
  />
</nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => {
  const getIcon = () => {
    switch (icon) {
      case 'dashboard':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        );
        // Add this case to the getIcon function in SidebarItem
case 'connections':
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
      case 'alert':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
          </svg>
        );
      case 'settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
        // Add this case to the getIcon function in SidebarItem
case 'sales':
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {getIcon()}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default Layout;