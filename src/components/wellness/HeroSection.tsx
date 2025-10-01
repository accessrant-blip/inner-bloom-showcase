import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";
import DemoModal from "./DemoModal";
import { useState } from "react";

const HeroSection = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Peaceful meditation scene representing mental wellness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <div className="animate-fade-up space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Your Journey to
            <span className="block gradient-hero bg-clip-text text-transparent">
              Mental Wellness
            </span>
            Starts Here
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Discover personalized tools, guided sessions, and professional support 
            to help you build lasting mental health habits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              variant="wellness"
              className="text-lg px-8 py-6"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => setIsDemoOpen(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Licensed Therapists</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Evidence-Based</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
      <div className="absolute bottom-32 left-16 w-12 h-12 bg-accent/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-8 w-8 h-8 bg-secondary-accent/30 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* Demo Modal */}
      <DemoModal open={isDemoOpen} onOpenChange={setIsDemoOpen} />
    </section>
  );
};

export default HeroSection;