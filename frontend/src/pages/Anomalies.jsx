import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AnomalyAlert from '../components/AnomalyAlert';

const Anomalies = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Unusual Revenue Drop",
      description: "Revenue decreased by 18% compared to last week. This exceeds your normal fluctuation threshold.",
      severity: "high",
      metric: "Revenue",
      change: -18,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "Customer Acquisition Spike",
      description: "New customer signups increased by 42% today. This could be tied to your recent marketing campaign.",
      severity: "medium",
      metric: "Acquisition",
      change: 42,
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      title: "Inventory Shortage Alert",
      description: "Three products are running low on inventory with less than 10 units remaining.",
      severity: "high",
      metric: "Inventory",
      change: -85,
      timestamp: "1 day ago"
    },
    {
      id: 4,
      title: "Website Traffic Increase",
      description: "Organic traffic increased by 65% this week. Check your SEO performance and recent content.",
      severity: "medium",
      metric: "Traffic",
      change: 65,
      timestamp: "2 days ago"
    }
  ]);

  const handleDismiss = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <DashboardLayout activePage="Anomalies">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Anomaly Detection</h1>
            <p className="text-gray-600">Real-time alerts for unusual patterns in your business data</p>
          </div>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>All Severity</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Active Alerts</h2>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              {alerts.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <AnomalyAlert
                key={alert.id}
                {...alert}
                onDismiss={() => handleDismiss(alert.id)}
              />
            ))}
          </div>

          {alerts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">Everything looks normal. We'll notify you when we detect anomalies.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Anomalies;