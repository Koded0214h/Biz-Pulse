import React, { useState } from 'react';
import { FiCheck, FiX, FiStar, FiAward } from 'react-icons/fi';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started with analytics',
      price: { monthly: 49, annual: 39 },
      features: [
        { name: 'Up to 5 data sources', included: true },
        { name: 'Basic analytics dashboard', included: true },
        { name: 'Weekly email reports', included: true },
        { name: 'Anomaly detection', included: true },
        { name: 'AI recommendations', included: false },
        { name: 'Custom metrics', included: false },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false }
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Advanced features for growing businesses',
      price: { monthly: 99, annual: 79 },
      features: [
        { name: 'Up to 15 data sources', included: true },
        { name: 'Advanced analytics dashboard', included: true },
        { name: 'Daily email reports', included: true },
        { name: 'Anomaly detection', included: true },
        { name: 'AI recommendations', included: true },
        { name: 'Custom metrics', included: true },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false }
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for established businesses',
      price: { monthly: 199, annual: 159 },
      features: [
        { name: 'Unlimited data sources', included: true },
        { name: 'Custom analytics dashboard', included: true },
        { name: 'Real-time reports', included: true },
        { name: 'Advanced anomaly detection', included: true },
        { name: 'AI recommendations', included: true },
        { name: 'Custom metrics', included: true },
        { name: 'Priority support', included: true },
        { name: 'API access', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`text-lg ${!isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-blue-600 rounded-full transition-colors duration-200"
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                isAnnual ? 'transform translate-x-8' : 'transform translate-x-1'
              }`} />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Annual <span className="text-green-500 text-sm">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative rounded-2xl border-2 ${
              plan.popular 
                ? 'border-orange-500 bg-gradient-to-b from-orange-50 to-white shadow-xl' 
                : 'border-gray-200 bg-white'
            } p-8 hover:shadow-lg transition-all duration-300`}>
              
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <FiStar className="w-4 h-4" />
                    <span>MOST POPULAR</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                {isAnnual && (
                  <p className="text-green-600 text-sm font-medium">Billed annually</p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <FiCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <FiX className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.cta === 'Contact Sales' ? '/contact' : '/register'}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-center block transition-colors duration-200 ${
                  plan.popular
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <FiAward className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Enterprise Features?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Custom solutions, dedicated support, and advanced security for large organizations.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-black transition-colors duration-200">
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;