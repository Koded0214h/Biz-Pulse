import React from 'react';
import { FiMail, FiEye, FiSend } from 'react-icons/fi';

const DigestPreview = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Weekly Digest Preview</h3>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <FiEye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200">
            <FiSend className="w-4 h-4" />
            <span>Send Test</span>
          </button>
        </div>
      </div>

      {/* Email Mockup */}
      <div className="border border-gray-300 rounded-lg bg-gray-50">
        {/* Email Header */}
        <div className="border-b border-gray-300 p-4 bg-white rounded-t-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FiMail className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">From: insights@bizpulse.ai</p>
              <p className="text-sm text-gray-500">To: your-email@business.com</p>
            </div>
          </div>
          <h4 className="text-xl font-semibold text-gray-800">Your Weekly Business Insights</h4>
          <p className="text-gray-600">Here's what happened in your business last week</p>
        </div>

        {/* Email Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">+12%</p>
              <p className="text-sm text-green-700">Revenue Growth</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">-8%</p>
              <p className="text-sm text-red-700">Customer Churn</p>
            </div>
          </div>

          {/* Top Insight */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-2">Key Insight</h5>
            <p className="text-blue-700 text-sm">
              Weekend sales showed 25% higher conversion rates. Consider extending 
              weekend promotions to drive more revenue.
            </p>
          </div>

          {/* Action Items */}
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Recommended Actions</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Restock inventory for Product X - low stock alert</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Review customer feedback from last week's orders</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Update pricing strategy for seasonal products</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200">
              View Full Report in BizPulse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigestPreview;