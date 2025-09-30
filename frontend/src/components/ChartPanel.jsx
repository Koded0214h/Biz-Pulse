import React from 'react';
import { FiDownload, FiMaximize2 } from 'react-icons/fi';

const ChartPanel = ({ title, type = 'line', data, timeframe = '30d' }) => {
  // Mock chart data - in real app, this would come from a charting library
  const renderMockChart = () => {
    const bars = type === 'bar' ? 12 : 30;
    
    return (
      <div className="h-48 flex items-end space-x-1 px-4">
        {Array.from({ length: bars }).map((_, i) => {
          const height = 20 + Math.random() * 80;
          const isHighlight = i === 15; // Mock highlighted bar for accent
          
          return (
            <div
              key={i}
              className={`flex-1 rounded-t ${
                isHighlight 
                  ? 'bg-orange-500' 
                  : type === 'bar' 
                    ? 'bg-teal-500' 
                    : 'bg-blue-500'
              } transition-all duration-300 hover:opacity-80`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 capitalize">{timeframe} • {type} chart</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-teal-600 transition-colors duration-200">
            <FiDownload className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-teal-600 transition-colors duration-200">
            <FiMaximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {renderMockChart()}
      
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-500">
          {type === 'line' ? 'Daily trends' : 'Monthly breakdown'}
        </div>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span className="text-gray-600">Previous</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;