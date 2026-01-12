import Navigation from "@/components/wellness/Navigation";
import HeroSection from "@/components/wellness/HeroSection";
import FeaturesSection from "@/components/wellness/FeaturesSection";
import HowItWorksSection from "@/components/wellness/HowItWorksSection";
import TestimonialsSection from "@/components/wellness/TestimonialsSection";
import BlogSection from "@/components/wellness/BlogSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogSection />
    </main>
  );
};

export default Index;
