// pages/Dashboard.jsx
import React from 'react';
import Layout from '../components/Layout';
import RevenueChart from '../components/RevenueChart';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Daily Revenue',
      value: '$12,450',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Customer Count',
      value: '1,200',
      change: '+2%',
      trend: 'up'
    },
    {
      title: 'Satisfaction Score',
      value: '4.5/5',
      change: '-1%',
      trend: 'down'
    }
  ];

  const recommendations = [
    {
      title: "Low engagement on 'Product X'",
      description: "Launch a targeted email campaign to re-engage customers.",
      action: "Create Campaign",
      type: "engagement"
    },
    {
      title: "Inventory for 'Item Y' is low",
      description: "Reorder stock now to avoid potential shortages and lost sales.",
      action: "Go to Inventory",
      type: "inventory"
    },
    {
      title: "Positive Feedback Spike",
      description: "Recent customer feedback shows high satisfaction with new features.",
      action: "View Feedback",
      type: "feedback"
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    );
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'engagement':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        );
      case 'inventory':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
            <path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z"/>
          </svg>
        );
      case 'feedback':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
            <path d="M14 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/>
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activePage="dashboard">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Good morning, Acme Inc.</h1>
          <p className="text-gray-600">Here's your business pulse for today</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{metric.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                <div className={`flex items-center space-x-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getTrendIcon(metric.trend)}
                  <span className="font-medium">{metric.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
            <RevenueChart />
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Top Recommendations</h3>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getRecommendationIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{rec.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        {rec.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;