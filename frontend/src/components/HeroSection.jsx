import React from 'react';
import { FiTrendingUp, FiAlertTriangle, FiBarChart2} from 'react-icons/fi';

const HeroSection = () => {
  const features = [
    {
      icon: FiBarChart2,
      title: 'Smart Analytics',
      description: 'Transform raw data into actionable insights with AI-powered analysis'
    },
    {
      icon: FiAlertTriangle,
      title: 'Anomaly Detection',
      description: 'Get instant alerts for unusual patterns in sales and customer behavior'
    },
    {
      icon: FiTrendingUp,
      title: 'AI Recommendations',
      description: 'Receive practical next steps tailored to your business needs'
    },
    {
      icon: FiTrendingUp,
      title: 'Growth Tracking',
      description: 'Monitor key metrics and trends with beautiful, easy-to-read dashboards'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FiBarChart2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BizPulse</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Sign In
              </a>
              <a 
                href="/register" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          AI-Powered Business Intelligence
          <span className="text-blue-600 block">for Small Businesses</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Turn your sales, feedback, and market data into clear narrative insights, 
          anomaly alerts, and action-oriented recommendations. Make faster, smarter decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a 
            href="/register" 
            className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-lg"
          >
            Start Free Trial
          </a>
          <a 
            href="#features" 
            className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            See How It Works
          </a>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-2 justify-start">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock dashboard cards */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-4/6"></div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Grow</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            BizPulse combines powerful analytics with AI-driven insights to help you understand 
            and optimize your business performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of small businesses using BizPulse to make data-driven decisions and drive growth.
          </p>
          <a 
            href="/register" 
            className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors duration-200 inline-block"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;