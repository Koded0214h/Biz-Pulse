import React from 'react';
import { FiStar } from 'react-icons/fi';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      company: 'Boutique Retail Co.',
      role: 'Founder & CEO',
      image: '/api/placeholder/100/100',
      content: 'BizPulse helped us identify seasonal trends we never noticed before. Our inventory optimization alone saved us 30% in carrying costs.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      company: 'Urban Eats Restaurant',
      role: 'Operations Manager',
      image: '/api/placeholder/100/100',
      content: 'The anomaly detection caught a pricing error that was costing us $2,000 monthly. Paid for itself in the first week.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      company: 'TechStart Solutions',
      role: 'CFO',
      image: '/api/placeholder/100/100',
      content: 'Finally, a business intelligence tool that speaks plain English. The narrative insights make data accessible to our entire team.',
      rating: 5
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Businesses Trust BizPulse' },
    { number: '98%', label: 'Customer Satisfaction' },
    { number: '2.5x', label: 'Faster Decision Making' },
    { number: '24/7', label: 'AI Monitoring' }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Forward-Thinking Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of businesses that have transformed their decision-making with BizPulse.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-blue-600">{testimonial.company}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="relative">
                <FiStar className="absolute -top-2 -left-1 w-8 h-8 text-blue-200" />
                <p className="text-gray-700 leading-relaxed relative z-10 pl-4">
                  {testimonial.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo Cloud */}
        <div className="mt-16">
          <p className="text-center text-gray-500 mb-8 font-medium">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 opacity-60">
            {['TechCorp', 'InnovateCo', 'GrowthLabs', 'SmartBiz', 'NextGen', 'FutureInc'].map((company) => (
              <div key={company} className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-gray-700 font-semibold">{company}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;