import React from 'react';
import { FiBarChart2, FiTrendingUp, FiShield, FiUsers, FiArrowRight, FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LandingHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-teal-800/50"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 29" fill="none" stroke="white" strokeWidth="2" >
              <path d="M21 12h-8l-3-3-3 3H3a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Z"/>
              <path d="m6 12 4-4 4 4"/>
            </svg>
          </div>
              </div>
              <span className="text-2xl font-bold text-white">BizPulse</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/90 hover:text-white transition-colors duration-200">Features</a>
              <a href="#solutions" className="text-white/90 hover:text-white transition-colors duration-200">Solutions</a>
              <a href="#pricing" className="text-white/90 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#testimonials" className="text-white/90 hover:text-white transition-colors duration-200">Customers</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white/90 hover:text-white transition-colors duration-200">
                Sign In
              </Link>
              <Link
                to="/register" 
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <FiTrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-white text-sm font-medium">Trusted by 5,000+ SMBs worldwide</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Intelligence
            <span className="text-blue-200 block">for Business</span>
            <span className="text-orange-400 block">Growth</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your business data into actionable insights with AI-powered analytics. 
            Make smarter decisions, faster than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="/register" 
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <FiArrowRight className="h-5 w-5" />
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-200 flex items-center justify-center space-x-2">
              <FiPlay className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-blue-200 text-sm">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">2.5x</div>
              <div className="text-blue-200 text-sm">Faster Decisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-blue-200 text-sm">AI Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">5min</div>
              <div className="text-blue-200 text-sm">Setup Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;