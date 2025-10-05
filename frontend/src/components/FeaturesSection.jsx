import React from 'react';
import { FiActivity, FiAlertTriangle, FiTarget, FiZap, FiPieChart, FiMessageSquare } from 'react-icons/fi';

const FeaturesSection = () => {
  const features = [
    {
      icon: FiActivity,
      title: 'Real-time Analytics',
      description: 'Monitor your business performance with live dashboards and real-time data streaming.',
      benefits: ['Live metrics', 'Instant updates', 'Performance tracking']
    },
    {
      icon: FiAlertTriangle,
      title: 'Smart Alerts',
      description: 'Get notified immediately when anomalies or opportunities are detected in your data.',
      benefits: ['Custom thresholds', 'Multi-channel alerts', 'Priority ranking']
    },
    {
      icon: FiTarget,
      title: 'AI Recommendations',
      description: 'Receive actionable insights and recommendations powered by machine learning algorithms.',
      benefits: ['Personalized advice', 'Growth opportunities', 'Risk mitigation']
    },
    {
      icon: FiZap,
      title: 'Automated Reporting',
      description: 'Save time with automated weekly reports and digest emails for stakeholders.',
      benefits: ['Custom schedules', 'Multiple formats', 'Team sharing']
    },
    {
      icon: FiPieChart,
      title: 'Data Visualization',
      description: 'Transform complex data into easy-to-understand charts and visual narratives.',
      benefits: ['Interactive charts', 'Export capabilities', 'Mobile responsive']
    },
    {
      icon: FiMessageSquare,
      title: 'Narrative Insights',
      description: 'Get plain-English explanations of what your data means and why it matters.',
      benefits: ['No jargon', 'Business context', 'Actionable stories']
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed specifically for small and medium businesses, BizPulse brings powerful 
            AI analytics to your fingertips without the enterprise complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to See It in Action?</h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of businesses that use BizPulse to drive growth and make data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Start Free Trial
            </a>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;