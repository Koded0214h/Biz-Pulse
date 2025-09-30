import React from 'react';
import { FiCheckCircle, FiClock, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const RecommendationList = ({ recommendations }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <FiClock className="w-4 h-4 text-orange-500" />;
      case 'low':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <FiCheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-orange-200 bg-orange-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Recommended Actions</h3>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getPriorityIcon(rec.priority)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">{rec.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="capitalize">{rec.priority} priority</span>
                    <span>•</span>
                    <span>{rec.impact} impact</span>
                  </div>
                </div>
              </div>
              
              <button className="ml-4 bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition-colors duration-200">
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;