import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartPanel from '../components/ChartPanel';

const Analytics = () => {
  return (
    <DashboardLayout activePage="Analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Deep dive into your business metrics and trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ChartPanel 
            title="Revenue Overview" 
            type="line" 
            timeframe="30d" 
          />
          <ChartPanel 
            title="Sales by Region" 
            type="bar" 
            timeframe="7d" 
          />
          <ChartPanel 
            title="Customer Growth" 
            type="line" 
            timeframe="90d" 
          />
          <ChartPanel 
            title="Product Performance" 
            type="bar" 
            timeframe="30d" 
          />
          <ChartPanel 
            title="Marketing ROI" 
            type="line" 
            timeframe="60d" 
          />
          <ChartPanel 
            title="Inventory Turnover" 
            type="bar" 
            timeframe="90d" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;