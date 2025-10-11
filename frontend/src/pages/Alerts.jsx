// pages/Alerts.jsx - COMPLETELY REVAMPED
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlerts, setSelectedAlerts] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  
  // Enhanced filters
  const [filters, setFilters] = useState({
    types: {
      lookout: true,
      forecast: true,
      bedrock: true,
      critical: true,
    },
    status: 'all', // all, unread, acknowledged, dismissed
    timeRange: '24h', // 24h, 7d, 30d, all
    priority: 'all' // all, critical, high, medium, low
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list, grid, timeline

  // Fetch all alerts data
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Apply filters whenever alerts or filters change
  useEffect(() => {
    applyFilters();
  }, [alerts, filters, searchTerm]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const [insightsData, alertsData, forecastsData] = await Promise.all([
        authAPI.getInsights(),
        authAPI.getAlerts(),
        authAPI.getForecasts()
      ]);

      const allAlerts = [];

      // Process Lookout for Metrics anomalies
      insightsData.filter(insight => insight.source === 'LOOKOUT').forEach(insight => {
        allAlerts.push({
          id: `lookout-${insight.id}`,
          title: insight.title,
          description: insight.summary,
          type: 'anomaly',
          source: 'LOOKOUT',
          priority: 'critical',
          timestamp: new Date(insight.created_at),
          status: 'unread',
          dataSource: insight.data_source_name,
          severity: 'CRITICAL',
          recommendations: insight.recommendations,
          category: 'anomaly'
        });
      });

      // Process Forecast predictions
      forecastsData.forEach(forecast => {
        const predictions = forecast.prediction_data || [];
        const currentValue = predictions[0]?.value || 0;
        const predictedValue = predictions[predictions.length - 1]?.value || 0;
        const change = ((predictedValue - currentValue) / currentValue) * 100;
        
        let priority = 'low';
        if (Math.abs(change) > 50) priority = 'critical';
        else if (Math.abs(change) > 25) priority = 'high';
        else if (Math.abs(change) > 10) priority = 'medium';

        allAlerts.push({
          id: `forecast-${forecast.id}`,
          title: `Forecast: ${forecast.metric_name}`,
          description: `Predicted ${change > 0 ? 'increase' : 'decrease'} of ${Math.abs(change).toFixed(1)}%`,
          type: 'forecast',
          source: 'FORECAST',
          priority,
          timestamp: new Date(forecast.prediction_time),
          status: 'unread',
          dataSource: forecast.data_source?.name || 'Forecast Service',
          change,
          predictions,
          category: 'prediction'
        });
      });

      // Process Bedrock insights
      insightsData.filter(insight => insight.source === 'BEDROCK').forEach(insight => {
        allAlerts.push({
          id: `insight-${insight.id}`,
          title: insight.title,
          description: insight.summary,
          type: 'insight',
          source: 'BEDROCK',
          priority: 'medium',
          timestamp: new Date(insight.created_at),
          status: 'unread',
          dataSource: insight.data_source_name,
          recommendations: insight.recommendations,
          category: 'insight'
        });
      });

      // Process traditional alerts
      alertsData.forEach(alert => {
        allAlerts.push({
          id: `alert-${alert.id}`,
          title: alert.insight?.title || 'Alert',
          description: alert.insight?.summary || 'Anomaly detected',
          type: 'alert',
          source: 'ALERT',
          priority: mapSeverityToPriority(alert.severity),
          timestamp: new Date(alert.timestamp || alert.created_at),
          status: alert.status?.toLowerCase() || 'unread',
          dataSource: alert.insight?.data_source_name || 'Unknown',
          severity: alert.severity,
          alertId: alert.id,
          category: 'alert'
        });
      });

      // Sort by timestamp (newest first)
      const sortedAlerts = allAlerts.sort((a, b) => b.timestamp - a.timestamp);
      setAlerts(sortedAlerts);

    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = alerts.filter(alert => {
      // Type filter
      if (!filters.types[alert.source.toLowerCase()] && !filters.types[alert.priority]) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && alert.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && alert.priority !== filters.priority) {
        return false;
      }

      // Time range filter
      const now = new Date();
      const alertTime = new Date(alert.timestamp);
      const timeDiff = now - alertTime;
      
      switch (filters.timeRange) {
        case '24h':
          if (timeDiff > 24 * 60 * 60 * 1000) return false;
          break;
        case '7d':
          if (timeDiff > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case '30d':
          if (timeDiff > 30 * 24 * 60 * 60 * 1000) return false;
          break;
        default:
          break;
      }

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!alert.title.toLowerCase().includes(term) && 
            !alert.description.toLowerCase().includes(term) &&
            !alert.dataSource.toLowerCase().includes(term)) {
          return false;
        }
      }

      return true;
    });

    setFilteredAlerts(filtered);
  };

  const mapSeverityToPriority = (severity) => {
    const mapping = {
      'CRITICAL': 'critical',
      'HIGH': 'high', 
      'MEDIUM': 'medium',
      'LOW': 'low'
    };
    return mapping[severity] || 'low';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: {
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        icon: '🛑'
      },
      high: {
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        icon: '⚠️'
      },
      medium: {
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        icon: '📊'
      },
      low: {
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        icon: 'ℹ️'
      }
    };
    return configs[priority] || configs.low;
  };

  const getSourceConfig = (source) => {
    const configs = {
      LOOKOUT: { name: 'Anomaly Detection', color: 'purple', icon: '🎯' },
      FORECAST: { name: 'Sales Forecast', color: 'blue', icon: '🔮' },
      BEDROCK: { name: 'AI Insights', color: 'indigo', icon: '🤖' },
      ALERT: { name: 'System Alert', color: 'red', icon: '🚨' }
    };
    return configs[source] || { name: source, color: 'gray', icon: '📄' };
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await authAPI.acknowledgeAlert(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.alertId === alertId ? { ...alert, status: 'acknowledged' } : alert
      ));
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      await authAPI.dismissAlert(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.alertId === alertId ? { ...alert, status: 'dismissed' } : alert
      ));
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedAlerts.size === 0) return;
    
    try {
      const alertIds = Array.from(selectedAlerts);
      await authAPI.bulkAlertAction({ alert_ids: alertIds, action: bulkAction });
      
      // Update local state
      setAlerts(prev => prev.map(alert => 
        selectedAlerts.has(alert.alertId) ? { ...alert, status: bulkAction + 'ed' } : alert
      ));
      
      setSelectedAlerts(new Set());
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const toggleSelectAlert = (alertId) => {
    const newSelected = new Set(selectedAlerts);
    if (newSelected.has(alertId)) {
      newSelected.delete(alertId);
    } else {
      newSelected.add(alertId);
    }
    setSelectedAlerts(newSelected);
  };

  const selectAllAlerts = () => {
    if (selectedAlerts.size === filteredAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map(alert => alert.alertId).filter(id => id)));
    }
  };

  // Stats for dashboard
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.priority === 'critical').length,
    unread: alerts.filter(a => a.status === 'unread').length,
    anomalies: alerts.filter(a => a.source === 'LOOKOUT').length
  };

  return (
    <Layout activePage="alerts">
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Alerts</h1>
              <p className="text-gray-600 mt-2">Monitor anomalies, forecasts, and insights across your business</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <span className="text-2xl">🛑</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Anomalies</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.anomalies}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bulk Actions */}
            {selectedAlerts.size > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Bulk Actions</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{selectedAlerts.size} alerts selected</p>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose action...</option>
                    <option value="acknowledge">Acknowledge</option>
                    <option value="dismiss">Dismiss</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Type Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">ALERT TYPES</h3>
              <div className="space-y-3">
                {Object.entries({
                  lookout: '🎯 Anomalies',
                  forecast: '🔮 Forecasts', 
                  bedrock: '🤖 AI Insights',
                  critical: '🛑 Critical'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.types[key]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        types: { ...prev.types, [key]: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">PRIORITY</h3>
              <div className="space-y-2">
                {['all', 'critical', 'high', 'medium', 'low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilters(prev => ({ ...prev, priority }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.priority === priority 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">TIME RANGE</h3>
              <div className="space-y-2">
                {['24h', '7d', '30d', 'all'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setFilters(prev => ({ ...prev, timeRange: range }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.timeRange === range 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range === '24h' ? 'Last 24 hours' :
                     range === '7d' ? 'Last 7 days' :
                     range === '30d' ? 'Last 30 days' : 'All time'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {filteredAlerts.length} Alerts
                  </h2>
                  {filteredAlerts.length > 0 && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.size === filteredAlerts.length}
                        onChange={selectAllAlerts}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Select all</span>
                    </label>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">
                    {alerts.filter(a => a.status === 'unread').length} unread
                  </span>
                  <button
                    onClick={fetchAlerts}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* Alerts Content */}
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading alerts...</p>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAlerts.map((alert) => {
                    const priorityConfig = getPriorityConfig(alert.priority);
                    const sourceConfig = getSourceConfig(alert.source);
                    
                    return (
                      <div
                        key={alert.id}
                        className={`p-6 transition-colors ${
                          selectedAlerts.has(alert.alertId) ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Selection Checkbox */}
                          {alert.alertId && (
                            <input
                              type="checkbox"
                              checked={selectedAlerts.has(alert.alertId)}
                              onChange={() => toggleSelectAlert(alert.alertId)}
                              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          )}
                          
                          {/* Alert Icon */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${priorityConfig.bgColor} ${priorityConfig.borderColor} border`}>
                              <span className="text-lg">{sourceConfig.icon}</span>
                            </div>
                          </div>

                          {/* Alert Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">{alert.title}</h3>
                              
                              {/* Priority Badge */}
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor}`}>
                                {priorityConfig.icon} {alert.priority}
                              </span>
                              
                              {/* Source Badge */}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {sourceConfig.name}
                              </span>

                              {/* Status Badge */}
                              {alert.status === 'unread' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>

                            <p className="text-gray-600 mb-3">{alert.description}</p>

                            {/* Metadata */}
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatTimeAgo(alert.timestamp)}</span>
                              </span>
                              
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>{alert.dataSource}</span>
                              </span>

                              {/* Forecast Change */}
                              {alert.change && (
                                <span className={`flex items-center space-x-1 ${
                                  alert.change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  <svg className={`w-4 h-4 ${alert.change > 0 ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                  </svg>
                                  <span>{Math.abs(alert.change).toFixed(1)}%</span>
                                </span>
                              )}
                            </div>

                            {/* Actions
                            <div className="flex items-center space-x-4 mt-4">
                              {alert.id && (
                                <>
                                  <button
                                    onClick={() => handleAcknowledge(alert.id)}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                  >
                                    Acknowledge
                                  </button>
                                  <button
                                    onClick={() => handleDismiss(alert.id)}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                  >
                                    Dismiss
                                  </button>
                                </>
                              )}
                              <button className="text-gray-500 hover:text-gray-700 text-sm">
                                View Details
                              </button>
                              {alert.recommendations && (
                                <button className="text-green-600 hover:text-green-700 text-sm">
                                  Show Recommendations
                                </button>
                              )}
                            </div> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Alerts;