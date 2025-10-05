import React from 'react';
import LandingHero from '../components/LandingHero';
import FeaturesSection from '../components/FeaturesSection';
import SolutionsSection from '../components/SolutionsSection';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingHero />
      <FeaturesSection />
      <SolutionsSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;