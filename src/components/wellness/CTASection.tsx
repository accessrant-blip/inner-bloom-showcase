import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Download, Smartphone, Clock, Lock } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-32 gradient-soft relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-mesh opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <Card className="max-w-5xl mx-auto glass border-primary/30 shadow-neon overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5"></div>
          
          <CardContent className="p-12 md:p-16 text-center relative z-10">
            <div className="animate-fade-up space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-4">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-sm text-muted-foreground">Start Your Journey Today</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                Ready to Transform Your
                <span className="block mt-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Mental Wellness?
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
                Join thousands who are already experiencing better mental health. Start your free trial and discover the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
                <Button 
                  size="lg" 
                  variant="wellness"
                  className="text-lg px-10 py-7 text-base font-semibold"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-10 py-7"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download App
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
                <div className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Mobile & Web</h3>
                  <p className="text-sm text-muted-foreground">Access anywhere, anytime</p>
                </div>
                
                <div className="glass p-6 rounded-2xl border border-border/50 hover:border-secondary/50 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">14-Day Free Trial</h3>
                  <p className="text-sm text-muted-foreground">No credit card required</p>
                </div>
                
                <div className="glass p-6 rounded-2xl border border-border/50 hover:border-accent/50 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">100% Private</h3>
                  <p className="text-sm text-muted-foreground">Your data stays secure</p>
                </div>
              </div>
              
              <div className="pt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>✓ Cancel anytime</span>
                <span>•</span>
                <span>✓ No commitment</span>
                <span>•</span>
                <span>✓ HIPAA compliant</span>
                <span>•</span>
                <span>✓ 24/7 Support</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
