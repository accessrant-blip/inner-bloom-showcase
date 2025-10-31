import Navigation from "@/components/wellness/Navigation";
import HeroSection from "@/components/wellness/HeroSection";
import FeaturesSection from "@/components/wellness/FeaturesSection";
import HowItWorksSection from "@/components/wellness/HowItWorksSection";
import TestimonialsSection from "@/components/wellness/TestimonialsSection";
import CTASection from "@/components/wellness/CTASection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
};

export default Index;
