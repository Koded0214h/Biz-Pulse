import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import InsightCard from '../components/InsightCard';
import ChartPanel from '../components/ChartPanel';
import AnomalyAlert from '../components/AnomalyAlert';
import RecommendationList from '../components/RecommendationList';

const Dashboard = () => {
  const mockInsights = [
    {
      title: "Weekend Sales Surge",
      description: "Your weekend sales have consistently outperformed weekdays by 35% over the last month. This pattern suggests strong potential for weekend-focused promotions.",
      metric: 35,
      trend: 35,
      nextStep: "Create a weekend promotion campaign to maximize revenue"
    },
    {
      title: "Inventory Alert - Product X",
      description: "Product X is trending with 200% higher sales this month. Current inventory levels may not sustain demand beyond next week.",
      metric: -45,
      trend: -45,
      nextStep: "Reorder Product X inventory immediately"
    }
  ];

  const mockAlerts = [
    {
      title: "Unusual Revenue Drop",
      description: "Revenue decreased by 18% compared to last week. This exceeds your normal fluctuation threshold.",
      severity: "high",
      metric: "Revenue",
      change: -18,
      timestamp: "2 hours ago"
    },
    {
      title: "Customer Acquisition Spike",
      description: "New customer signups increased by 42% today. This could be tied to your recent marketing campaign.",
      severity: "medium",
      metric: "Acquisition",
      change: 42,
      timestamp: "5 hours ago"
    }
  ];

  const mockRecommendations = [
    {
      title: "Optimize Ad Spend",
      description: "Increase budget for top-performing channels by 15% to capitalize on current conversion rates.",
      priority: "high",
      impact: "High"
    },
    {
      title: "Update Product Descriptions",
      description: "Enhance product pages with customer reviews and better images to improve conversion.",
      priority: "medium",
      impact: "Medium"
    },
    {
      title: "Customer Feedback Analysis",
      description: "Review recent customer feedback to identify common pain points and improvement opportunities.",
      priority: "low",
      impact: "Medium"
    }
  ];

  return (
    <DashboardLayout activePage="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Overview</h1>
            <p className="text-gray-600">Here's what's happening with your business today</p>
          </div>
          <div className="text-sm text-gray-500">Last updated: Today, 2:30 PM</div>
        </div>

        {/* Anomaly Alerts */}
        <div>
          {mockAlerts.map((alert, index) => (
            <AnomalyAlert key={index} {...alert} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Insights */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Insights</h2>
              <div className="space-y-4">
                {mockInsights.map((insight, index) => (
                  <InsightCard key={index} {...insight} />
                ))}
              </div>
            </div>

            {/* Charts */}
            <ChartPanel 
              title="Revenue Trends" 
              type="line" 
              timeframe="30d" 
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recommendations */}
            <RecommendationList recommendations={mockRecommendations} />

            {/* Additional Charts */}
            <ChartPanel 
              title="Sales by Category" 
              type="bar" 
              timeframe="7d" 
            />
            
            <ChartPanel 
              title="Customer Acquisition" 
              type="line" 
              timeframe="90d" 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;