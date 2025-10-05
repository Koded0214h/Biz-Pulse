import React from 'react';
import { FiShoppingCart, FiCoffee, FiTruck, FiHome, FiBriefcase, FiDollarSign } from 'react-icons/fi';

const SolutionsSection = () => {
  const solutions = [
    {
      icon: FiShoppingCart,
      title: 'E-commerce & Retail',
      description: 'Optimize inventory, track sales trends, and understand customer behavior.',
      metrics: ['Sales analytics', 'Inventory optimization', 'Customer insights']
    },
    {
      icon: FiCoffee,
      title: 'Restaurants & Hospitality',
      description: 'Monitor table turnover, menu performance, and seasonal demand patterns.',
      metrics: ['Menu performance', 'Peak hour analysis', 'Customer satisfaction']
    },
    {
      icon: FiTruck,
      title: 'Logistics & Services',
      description: 'Track delivery performance, optimize routes, and manage service efficiency.',
      metrics: ['Delivery analytics', 'Route optimization', 'Service metrics']
    },
    {
      icon: FiHome,
      title: 'Real Estate',
      description: 'Analyze property performance, market trends, and investment opportunities.',
      metrics: ['Property analytics', 'Market trends', 'ROI tracking']
    },
    {
      icon: FiBriefcase,
      title: 'Professional Services',
      description: 'Monitor project profitability, resource allocation, and client satisfaction.',
      metrics: ['Project analytics', 'Resource tracking', 'Client insights']
    },
    {
      icon: FiDollarSign,
      title: 'Financial Services',
      description: 'Track portfolio performance, client behavior, and market opportunities.',
      metrics: ['Portfolio analytics', 'Client behavior', 'Risk assessment']
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for Your Industry
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            BizPulse adapts to your specific business needs with industry-tailored insights and metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                <solution.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{solution.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {solution.metrics.map((metric, metricIndex) => (
                  <span key={metricIndex} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h3>
            <p className="text-gray-600 text-lg">Connect with your favorite tools and platforms</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Shopify', 'Stripe', 'QuickBooks', 'Salesforce', 'Google Analytics', 'Mailchimp'].map((platform) => (
              <div key={platform} className="bg-gray-50 rounded-xl p-4 text-center hover:bg-blue-50 transition-colors duration-200">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;