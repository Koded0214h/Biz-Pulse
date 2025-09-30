import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DigestPreview from '../components/DigestPreview';

const Reports = () => {
  return (
    <DashboardLayout activePage="Reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Digest</h1>
          <p className="text-gray-600">Automated reports and weekly business summaries</p>
        </div>

        <DigestPreview />

        {/* Report History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'Weekly Digest - Dec 10', date: 'Dec 10, 2023', recipients: 3, status: 'Delivered' },
              { name: 'Monthly Performance Review', date: 'Dec 1, 2023', recipients: 5, status: 'Delivered' },
              { name: 'Q4 Business Summary', date: 'Nov 25, 2023', recipients: 4, status: 'Delivered' },
              { name: 'Weekly Digest - Dec 3', date: 'Dec 3, 2023', recipients: 3, status: 'Failed' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">PDF</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.date} • {report.recipients} recipients</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    report.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;