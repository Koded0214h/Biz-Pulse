import React, { useState } from 'react';
import { FiHome, FiBarChart2, FiAlertTriangle, FiSettings, FiMail, FiUpload, FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineLightBulb } from 'react-icons/hi';

const DashboardLayout = ({ children, activePage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Insights', icon: HiOutlineLightBulb, href: '/insights' },
    { name: 'Analytics', icon: FiBarChart2, href: '/analytics' },
    { name: 'Anomalies', icon: FiAlertTriangle, href: '/anomalies' },
    { name: 'Data Sources', icon: FiUpload, href: '/data-sources' },
    { name: 'Reports', icon: FiMail, href: '/reports' },
    { name: 'Settings', icon: FiSettings, href: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-blue-700 transition duration-300 transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-blue-600">
          <div className="flex items-center">
            <HiOutlineChartBar className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">BizPulse</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-white transition-colors duration-200 ${
                activePage === item.name.toLowerCase() 
                  ? 'bg-blue-600 border-r-4 border-orange-500' 
                  : 'hover:bg-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="mx-4 font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600"
              >
                <FiMenu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-800">{activePage}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;