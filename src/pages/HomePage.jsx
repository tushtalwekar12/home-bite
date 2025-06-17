import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";
import ProvidersSection from "../components/home/ProvidersSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ProvidersSection />
      <CTASection />
    </div>
  );
};

export default HomePage; 