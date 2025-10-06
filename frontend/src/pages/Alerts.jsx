// pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../api';

const Alerts = () => {
  const [filters, setFilters] = useState({
    types: {
      aiInsights: false,
      systemErrors: true,
      performanceDips: false,
      opportunities: false,
      socialMedia: false,
    },
    priority: 'all',
    status: 'all',
    date: ''
  });

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authAPI.getInsights();
        // Sort insights by created_at descending
        const sortedInsights = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // Map backend insight data to frontend alert shape
        const mappedAlerts = sortedInsights.map(insight => ({
          id: insight.id,
          title: insight.title,
          time: formatTimeAgo(new Date(insight.created_at)),
          description: insight.summary,
          priority: mapSourceToPriority(insight.source),
          type: mapSourceToType(insight.source),
          unread: true, // Mark all as unread for now
        }));
        setAlerts(mappedAlerts);
      } catch (err) {
        setError('Failed to load alerts. Please try again later.');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const mapSourceToPriority = (source) => {
    switch (source) {
      case 'LOOKOUT': return 'high';
      case 'BEDROCK': return 'medium';
      case 'FORECAST': return 'low';
      default: return 'low';
    }
  };

  const mapSourceToType = (source) => {
    switch (source) {
      case 'LOOKOUT': return 'aiInsights';
      case 'BEDROCK': return 'systemErrors';
      case 'FORECAST': return 'opportunities';
      default: return 'systemErrors';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Filter alerts based on filters and search
  const filteredAlerts = alerts.filter(alert => {
    // Type filter
    const typeChecked = filters.types[alert.type];
    if (!typeChecked) return false;

    // Priority filter
    if (filters.priority !== 'all' && alert.priority !== filters.priority) return false;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!alert.title.toLowerCase().includes(term) && !alert.description.toLowerCase().includes(term)) return false;
    }

    return true;
  });

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC2626" stroke="#DC2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6" stroke="white" strokeWidth="2"/>
            <path d="m9 9 6 6" stroke="white" strokeWidth="2"/>
          </svg>
        );
      case 'high':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4" stroke="white" strokeWidth="2"/>
            <path d="M12 17h.01" stroke="white" strokeWidth="2"/>
          </svg>
        );
      case 'medium':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4" stroke="white" strokeWidth="2"/>
            <path d="M12 17h.01" stroke="white" strokeWidth="2"/>
          </svg>
        );
      case 'low':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#10B981" stroke="#10B981" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Layout activePage="alerts">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">BizPulse</h1>
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">FILTER BY TYPE</h3>
              <div className="space-y-3">
                {Object.entries(filters.types).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        types: { ...prev.types, [key]: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">FILTER BY PRIORITY</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilters(prev => ({ ...prev, priority: priority.toLowerCase() }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.priority === priority.toLowerCase() 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">All Alerts</h2>
              </div>
              
              {loading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading alerts...</p>
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAlerts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No alerts match your filters.
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getPriorityIcon(alert.priority)}
                              <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                              {alert.unread && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{alert.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-500">{alert.time}</span>
                              <button className="text-blue-600 hover:text-blue-700 font-medium">View Details</button>
                              <button className="text-gray-500 hover:text-gray-700">Dismiss</button>
                              <button className="text-gray-500 hover:text-gray-700">Archive</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="p-6 bg-green-50 border-t border-green-200">
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981" stroke="#10B981" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="text-green-800 font-medium">All clear! BizPulse is keeping an eye on things for you.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Alerts;