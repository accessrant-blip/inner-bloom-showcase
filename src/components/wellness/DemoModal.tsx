import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, UserCheck, Calendar, BookOpen, Shield, Globe, Lock, Eye, Sparkles } from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const features = [
    {
      icon: MessageSquare,
      title: "Post Your Rant",
      description: "Express yourself freely with flexible privacy options that put you in control",
      gradient: "from-primary to-primary-glow",
      options: [
        { icon: Globe, label: "Public", color: "border-blue-500/50 bg-blue-500/10" },
        { icon: Eye, label: "Anonymous", color: "border-purple-500/50 bg-purple-500/10" },
        { icon: Lock, label: "Private", color: "border-green-500/50 bg-green-500/10" }
      ]
    },
    {
      icon: Calendar,
      title: "Book a Therapist",
      description: "Connect with licensed professionals when you need support",
      gradient: "from-secondary to-secondary-accent",
      demo: "Schedule sessions with verified therapists in minutes"
    },
    {
      icon: UserCheck,
      title: "Hire Human Friends", 
      description: "Find compassionate listeners for emotional support and genuine connection",
      gradient: "from-accent to-accent",
      demo: "Connect with trained peer supporters who understand"
    },
    {
      icon: BookOpen,
      title: "Personal Journal",
      description: "Track your thoughts and emotions in a safe, private space",
      gradient: "from-primary to-secondary",
      demo: "Daily reflections, mood tracking & progress insights"
    },
    {
      icon: Shield,
      title: "Instant Panic Relief",
      description: "Quick access to calming techniques and emergency support when you need it most",
      gradient: "from-secondary to-accent",
      demo: "Breathing exercises, grounding techniques & crisis hotlines"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto glass border-primary/30">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary animate-glow" />
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              How Rant Works
            </DialogTitle>
          </div>
          <p className="text-center text-muted-foreground">
            Discover all the powerful features designed for your mental wellness journey
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="glass border-border/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300 overflow-hidden group"
              style={{animationDelay: `${index * 50}ms`}}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    {feature.options && (
                      <div className="flex gap-3 flex-wrap">
                        {feature.options.map((option) => (
                          <Badge 
                            key={option.label} 
                            variant="outline"
                            className={`flex items-center gap-2 px-4 py-2 ${option.color} border-2 hover:scale-105 transition-transform cursor-pointer`}
                          >
                            <option.icon className="w-4 h-4" />
                            <span className="font-semibold">{option.label}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {feature.demo && (
                      <div className="glass rounded-xl p-4 border border-border/50">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-primary">Demo: </span>
                            <span className="text-sm text-muted-foreground">{feature.demo}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-6 text-lg">
              Ready to start your mental wellness journey?
            </p>
            <Button 
              size="lg" 
              variant="wellness"
              className="text-lg px-10 py-6 font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Get Started Now
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Free 14-day trial • No credit card required
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
