import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import InsightCard from '../components/InsightCard';

const Insights = () => {
  const mockInsights = [
    {
      title: "Seasonal Demand Pattern",
      description: "Analysis shows consistent 40% revenue increase during holiday seasons. Plan inventory and marketing accordingly.",
      metric: 40,
      trend: 40,
      nextStep: "Prepare holiday marketing campaign and inventory"
    },
    {
      title: "Customer Retention Improved",
      description: "Repeat customer rate increased by 15% this quarter, indicating successful loyalty programs.",
      metric: 15,
      trend: 15,
      nextStep: "Expand successful loyalty program features"
    },
    {
      title: "Shipping Cost Optimization",
      description: "Consolidating shipments could reduce logistics costs by 22% without impacting delivery times.",
      metric: -22,
      trend: -22,
      nextStep: "Review and optimize shipping strategy"
    },
    {
      title: "Mobile Conversion Rate",
      description: "Mobile users convert 30% less than desktop users. Mobile experience optimization could recover lost revenue.",
      metric: -30,
      trend: -30,
      nextStep: "Audit and improve mobile user experience"
    }
  ];

  return (
    <DashboardLayout activePage="Insights">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Insights</h1>
            <p className="text-gray-600">AI-powered insights from your business data</p>
          </div>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>All Categories</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Operations</option>
            </select>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Generate New Insights
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockInsights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;