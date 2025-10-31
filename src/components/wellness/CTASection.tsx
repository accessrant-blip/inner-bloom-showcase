import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Download, Smartphone } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

const CTASection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  return (
    <section className="py-24 gradient-hero">
      <div className="container mx-auto px-6">
        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-card/95 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="animate-fade-up space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-balance">
                Ready to Transform Your
                <span className="text-primary block">Mental Wellness?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Join thousands of people who are already experiencing better mental health. 
                Start your free trial today and discover the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button 
                  size="lg" 
                  variant="wellness"
                  className="text-lg px-8 py-6"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6 border-border hover:bg-accent/10"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download App
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="font-semibold">Mobile & Web</h3>
                  <p className="text-sm text-muted-foreground">Access anywhere, anytime</p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🆓</span>
                  </div>
                  <h3 className="font-semibold">14-Day Free Trial</h3>
                  <p className="text-sm text-muted-foreground">No credit card required</p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="font-semibold">100% Private</h3>
                  <p className="text-sm text-muted-foreground">Your data stays secure</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground pt-8">
                Cancel anytime • No commitment • HIPAA compliant
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultTab="signup" />
    </section>
  );
};

export default CTASection;