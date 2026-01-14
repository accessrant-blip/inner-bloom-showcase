import Navigation from "@/components/wellness/Navigation";
import HeroSection from "@/components/wellness/HeroSection";
import FeaturesSection from "@/components/wellness/FeaturesSection";
import WordConnectSection from "@/components/wellness/WordConnectSection";
import HowItWorksSection from "@/components/wellness/HowItWorksSection";
import TestimonialsSection from "@/components/wellness/TestimonialsSection";
import BlogSection from "@/components/wellness/BlogSection";
import CTASection from "@/components/wellness/CTASection";
import Footer from "@/components/wellness/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <WordConnectSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
