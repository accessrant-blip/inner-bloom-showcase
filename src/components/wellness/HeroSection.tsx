import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Award, Users } from "lucide-react";
import DemoModal from "./DemoModal";
import { useState } from "react";

const HeroSection = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl pt-20">
        <div className="animate-fade-up space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 animate-glow">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm text-muted-foreground">Transform Your Mental Wellness Journey</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-balance leading-tight">
            Your Safe Space to
            <span className="block mt-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Rant, Heal & Grow
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Express yourself freely, connect with therapists, find support, and access instant relief - all in one powerful platform designed for your mental wellness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg" 
              variant="wellness"
              className="text-lg px-10 py-7 text-base font-semibold"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-7"
              onClick={() => setIsDemoOpen(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="glass p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <Shield className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-sm font-semibold mb-1">100% Private</div>
              <div className="text-xs text-muted-foreground">End-to-end encrypted</div>
            </div>
            
            <div className="glass p-6 rounded-2xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
              <Award className="w-8 h-8 mx-auto mb-3 text-secondary group-hover:scale-110 transition-transform" />
              <div className="text-sm font-semibold mb-1">Licensed Therapists</div>
              <div className="text-xs text-muted-foreground">Professional support 24/7</div>
            </div>
            
            <div className="glass p-6 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 group">
              <Users className="w-8 h-8 mx-auto mb-3 text-accent group-hover:scale-110 transition-transform" />
              <div className="text-sm font-semibold mb-1">10k+ Community</div>
              <div className="text-xs text-muted-foreground">Join supportive peers</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Modal */}
      <DemoModal open={isDemoOpen} onOpenChange={setIsDemoOpen} />
    </section>
  );
};

export default HeroSection;
