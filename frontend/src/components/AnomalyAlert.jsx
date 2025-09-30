import React from 'react';
import { FiAlertTriangle, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi';

const AnomalyAlert = ({ title, description, severity = 'medium', metric, change, timestamp, onDismiss }) => {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          text: 'text-red-700'
        };
      case 'medium':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-500',
          text: 'text-orange-700'
        };
      case 'low':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-500',
          text: 'text-yellow-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-500',
          text: 'text-gray-700'
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`${styles.bg} border-l-4 ${styles.border} rounded-r-lg p-4 mb-4 animate-pulse`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <FiAlertTriangle className={`w-5 h-5 mt-0.5 ${styles.icon}`} />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={`font-semibold ${styles.text}`}>{title}</h4>
              {metric && (
                <div className={`flex items-center space-x-1 text-sm ${
                  change > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {change > 0 ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-2">{description}</p>
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
        </div>
        
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnomalyAlert;