import Navigation from "@/components/wellness/Navigation";
import HeroSection from "@/components/wellness/HeroSection";

import HowItWorksSection from "@/components/wellness/HowItWorksSection";
import TestimonialsSection from "@/components/wellness/TestimonialsSection";
import CTASection from "@/components/wellness/CTASection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
};

export default Index;
