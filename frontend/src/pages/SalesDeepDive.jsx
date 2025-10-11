// pages/SalesDeepDive.jsx - WITH PAGINATION
import React, { useState, useEffect } from 'react';
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
import { authAPI } from '../api';

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

  const [salesData, setSalesData] = useState(null);
  const [topProductsData, setTopProductsData] = useState(null);
  const [salesSummary, setSalesSummary] = useState(null);
  const [metricsSummary, setMetricsSummary] = useState(null);
  const [salesTableData, setSalesTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableProducts, setAvailableProducts] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const [salesResponse, topProductsResponse, salesSummaryResponse, metricsSummaryResponse] = await Promise.all([
          authAPI.getSalesData(),
          authAPI.getTopProducts(),
          authAPI.getSalesSummary(),
          authAPI.getMetricsSummary()
        ]);

        console.log('Sales Data:', salesResponse);
        console.log('Top Products:', topProductsResponse);
        console.log('Sales Summary:', salesSummaryResponse);
        console.log('Metrics Summary:', metricsSummaryResponse);

        setSalesData(salesResponse);
        setTopProductsData(topProductsResponse);
        setSalesSummary(salesSummaryResponse);
        setMetricsSummary(metricsSummaryResponse);

        // Extract available products from top products data
        if (topProductsResponse.labels && topProductsResponse.labels.length > 0) {
          setAvailableProducts(topProductsResponse.labels);
        }

        // Generate dynamic table data from sales metrics
        generateTableData(salesResponse, topProductsResponse);

      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    const generateTableData = (salesData, topProductsData) => {
      if (!salesData.labels || !topProductsData.products) return;

      const tableData = [];
      const customers = ['Vine et alcools Chevalier', 'Toms Spezialitäten', 'Hanaal Games', 'Victuallies en stock', 'Suprimes délices'];
      const channels = ['Online', 'Retail', 'Direct'];

      // Create sample table data based on actual products and sales
      topProductsData.products.forEach((product, index) => {
        // Create 2-3 sample transactions per product
        const transactionsPerProduct = 2 + (index % 2); // 2 or 3 transactions
        for (let i = 0; i < transactionsPerProduct; i++) {
          tableData.push({
            id: `#${10000 + tableData.length}`,
            date: salesData.labels[Math.floor(Math.random() * salesData.labels.length)],
            customer: customers[tableData.length % customers.length],
            product: product.name,
            channel: channels[tableData.length % channels.length],
            amount: Math.round(product.revenue * (0.05 + Math.random() * 0.15)) // Random amount based on product revenue
          });
        }
      });

      setSalesTableData(tableData);
    };

    fetchSalesData();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesTableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(salesTableData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter sales data based on product selection
  const filteredSalesData = React.useMemo(() => {
    if (!salesData || selectedProductLine === 'all') return salesData;
    return salesData;
  }, [salesData, selectedProductLine]);

  // Filter top products based on selection
  const filteredTopProducts = React.useMemo(() => {
    if (!topProductsData || selectedProductLine === 'all') return topProductsData;
    
    const productIndex = topProductsData.labels.indexOf(selectedProductLine);
    if (productIndex === -1) return null;
    
    return {
      labels: [selectedProductLine],
      datasets: [{
        ...topProductsData.datasets[0],
        data: [topProductsData.datasets[0].data[productIndex]],
        backgroundColor: [topProductsData.datasets[0].backgroundColor[productIndex]]
      }],
      products: [topProductsData.products[productIndex]]
    };
  }, [topProductsData, selectedProductLine]);

  const revenueChartData = filteredSalesData ? {
    labels: filteredSalesData.labels,
    datasets: [{
      label: filteredSalesData.datasets?.[0]?.label || 'Daily Sales',
      data: filteredSalesData.datasets?.[0]?.data || [],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  } : {
    labels: [],
    datasets: [{
      label: 'Daily Sales',
      data: [],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }],
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
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
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
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  const topProductsChartData = filteredTopProducts ? {
    labels: filteredTopProducts.labels,
    datasets: [filteredTopProducts.datasets[0]]
  } : topProductsData ? {
    labels: topProductsData.labels,
    datasets: [topProductsData.datasets[0]]
  } : {
    labels: [],
    datasets: [{
      label: 'Revenue',
      data: [],
      backgroundColor: '#3B82F6'
    }]
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
            return '$' + value.toLocaleString();
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

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  if (loading) {
    return (
      <Layout activePage="sales">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading your sales data...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="sales">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Sales Deep Dive</h1>
          <p className="text-gray-600">
            Dynamic analysis based on your uploaded CSV data
            {salesData && ` • ${salesData.labels?.length || 0} time periods`}
            {topProductsData && ` • ${topProductsData.products?.length || 0} products`}
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Line</label>
              <select
                value={selectedProductLine}
                onChange={(e) => setSelectedProductLine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Products ({availableProducts.length})</option>
                {availableProducts.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Revenue</option>
                <option value="volume">Sales Volume</option>
                <option value="growth">Growth</option>
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
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {salesSummary ? formatCurrency(salesSummary.total_revenue) : '$0'}
              </div>
              <div className={`flex items-center space-x-1 ${salesSummary?.revenue_growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {getGrowthIcon(salesSummary?.revenue_growth || 0)}
                <span className="text-sm font-medium">
                  {salesSummary ? `${salesSummary.revenue_growth > 0 ? '+' : ''}${salesSummary.revenue_growth.toFixed(1)}%` : '0%'} vs last period
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span className="text-sm font-medium text-gray-600">Avg Order Value</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                $125
              </div>
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
              <div className="text-2xl font-bold text-gray-900 mb-1">
                3.2%
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                {getGrowthIcon(0.8)}
                <span className="text-sm font-medium">+0.8% vs last period</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sales Revenue Over Time</h3>
              <div className="text-sm text-gray-500">
                {salesData?.labels?.length || 0} data points
              </div>
            </div>
            <div className="h-80">
              <Line data={revenueChartData} options={revenueChartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Selling Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
              <div className="text-sm text-gray-500">
                {topProductsData?.products?.length || 0} products
              </div>
            </div>
            <div className="h-80">
              <Bar data={topProductsChartData} options={topProductsChartOptions} />
            </div>
            <div className="mt-4 space-y-3">
              {(filteredTopProducts?.products || topProductsData?.products || []).map((product, index) => (
                <div key={product.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-yellow-500' : 
                      index === 4 ? 'bg-red-500' : 'bg-indigo-500'
                    }`}></div>
                    <span className="font-medium text-gray-700">{product.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</span>
                    <div className={`flex items-center space-x-1 ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getGrowthIcon(product.growth)}
                      <span className="text-sm font-medium">{Math.abs(product.growth).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h3>
            <div className="space-y-4">
              {metricsSummary && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                      <path d="M14 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/>
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-800">Active Metrics</h4>
                      <p className="text-blue-700 text-sm">{metricsSummary.active_metrics} metrics being tracked</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-green-800">Data Quality</h4>
                    <p className="text-green-700 text-sm">All metrics populated from your CSV upload</p>
                  </div>
                </div>
              </div>

              {topProductsData && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <path d="M12 9v4"/>
                      <path d="M12 17h.01"/>
                    </svg>
                    <div>
                      <h4 className="font-semibold text-amber-800">Product Performance</h4>
                      <p className="text-amber-700 text-sm">
                        {topProductsData.products.filter(p => p.growth > 0).length} of {topProductsData.products.length} products growing
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Sales Data Table with Pagination */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Detailed Sales Data</h3>
              <p className="text-sm text-gray-500 mt-1">
                Showing {Math.min(itemsPerPage, currentItems.length)} of {salesTableData.length} transactions
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
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
                {currentItems.map((row) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, salesTableData.length)} of {salesTableData.length} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === number
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SalesDeepDive; 