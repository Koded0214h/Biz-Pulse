import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiArrowRight } from 'react-icons/fi';

const InsightCard = ({ title, description, metric, trend, nextStep, type = 'positive' }) => {
  const getTrendIcon = () => {
    if (trend > 0) return <FiTrendingUp className="text-green-500" />;
    if (trend < 0) return <FiTrendingDown className="text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {metric && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-medium">
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      
      {nextStep && (
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-teal-800 mb-1">Next Step</h4>
              <p className="text-teal-700 text-sm">{nextStep}</p>
            </div>
            <button className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors duration-200">
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightCard;