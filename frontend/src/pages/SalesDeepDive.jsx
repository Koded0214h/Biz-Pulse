// pages/SalesDeepDive.jsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesDeepDive = () => {
  const [selectedProductLine, setSelectedProductLine] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [385000, 420000, 398000, 452000, 482019, 515000, 538000, 512000, 545000, 568000, 592000, 615000],
  };

  const topProducts = [
    { name: 'Product Alpha', revenue: 1250000, growth: 15.2 },
    { name: 'Product Bravo', revenue: 980000, growth: 8.7 },
    { name: 'Product Charlie', revenue: 765000, growth: 22.1 },
    { name: 'Product Delta', revenue: 543000, growth: -3.4 },
    { name: 'Product Echo', revenue: 432000, growth: 12.8 },
  ];

  const salesTableData = [
    { id: '#10248', date: '2024-08-01', customer: 'Vine et alcools Chevalier', product: 'Product Alpha', channel: 'Online', amount: 322.00 },
    { id: '#10249', date: '2024-08-01', customer: 'Toms Spezialitäten', product: 'Product Bravo', channel: 'Retail', amount: 198.50 },
    { id: '#10250', date: '2024-08-02', customer: 'Hanaal Games', product: 'Product Charlie', channel: 'Online', amount: 85.40 },
    { id: '#10251', date: '2024-08-02', customer: 'Victuallies en stock', product: 'Product Alpha', channel: 'Direct', amount: 512.20 },
    { id: '#10252', date: '2024-08-03', customer: 'Suprimes délices', product: 'Product Echo', channel: 'Retail', amount: 450.00 },
  ];

  const revenueChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: salesData.revenue,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Revenue: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
        },
        border: {
          display: false,
        },
        ticks: {
          callback: function(value) {
            return '$' + (value / 1000).toFixed(0) + 'K';
          },
        },
      },
    },
  };

  const topProductsChartData = {
    labels: topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Revenue',
        data: topProducts.map(product => product.revenue),
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  };

  const topProductsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
        },
        border: {
          display: false,
        },
        ticks: {
          callback: function(value) {
            return '$' + (value / 1000).toFixed(0) + 'K';
          },
        },
      },
    },
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout activePage="sales">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sales Deep Dive</h1>
          <p className="text-gray-600">Detailed analysis of your sales performance and trends</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Line</label>
              <select 
                value={selectedProductLine}
                onChange={(e) => setSelectedProductLine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Products</option>
                <option value="alpha">Product Alpha</option>
                <option value="bravo">Product Bravo</option>
                <option value="charlie">Product Charlie</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Segment</label>
              <select 
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Segments</option>
                <option value="enterprise">Enterprise</option>
                <option value="sme">SME</option>
                <option value="startup">Startup</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sales Channel</label>
              <select 
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Channels</option>
                <option value="online">Online</option>
                <option value="retail">Retail</option>
                <option value="direct">Direct</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Metrics */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$4,820,193</div>
              <div className="flex items-center space-x-1 text-green-600">
                {getGrowthIcon(12.5)}
                <span className="text-sm font-medium">+12.5% vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span className="text-sm font-medium text-gray-600">Average Order Value</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$245.50</div>
              <div className="flex items-center space-x-1 text-green-600">
                {getGrowthIcon(2.1)}
                <span className="text-sm font-medium">+2.1% vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">3.4%</div>
              <div className="flex items-center space-x-1 text-green-600">
                {getGrowthIcon(0.8)}
                <span className="text-sm font-medium">+0.8% vs last period</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Over Time</h3>
            <div className="h-80">
              <Line data={revenueChartData} options={revenueChartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Selling Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
            <div className="h-80">
              <Bar data={topProductsChartData} options={topProductsChartOptions} />
            </div>
            <div className="mt-4 space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-purple-500' : 
                      index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium text-gray-700">{product.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</span>
                    <div className={`flex items-center space-x-1 ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getGrowthIcon(product.growth)}
                      <span className="text-sm font-medium">{Math.abs(product.growth)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional metrics or placeholder for future charts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                    <path d="M14 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/>
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800">Strong Online Growth</h4>
                    <p className="text-blue-700 text-sm">Online sales increased by 28% this quarter</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-green-800">Conversion Optimized</h4>
                    <p className="text-green-700 text-sm">Mobile conversion rate improved by 15%</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                    <path d="M12 9v4"/>
                    <path d="M12 17h.01"/>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-amber-800">Seasonal Opportunity</h4>
                    <p className="text-amber-700 text-sm">Q4 holiday sales potential identified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sales Data Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Detailed Sales Data</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHANNEL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesTableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.channel === 'Online' ? 'bg-blue-100 text-blue-800' :
                        row.channel === 'Retail' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {row.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalesDeepDive;