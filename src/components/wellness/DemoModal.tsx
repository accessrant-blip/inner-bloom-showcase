import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, UserCheck, Calendar, BookOpen, Shield, Globe, Lock, Eye } from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const features = [
    {
      icon: MessageSquare,
      title: "Post Your Rant",
      description: "Express yourself freely with flexible privacy options",
      options: [
        { icon: Globe, label: "Public", color: "bg-blue-500" },
        { icon: Eye, label: "Anonymous", color: "bg-purple-500" },
        { icon: Lock, label: "Private", color: "bg-green-500" }
      ]
    },
    {
      icon: Calendar,
      title: "Book a Therapist",
      description: "Connect with licensed professionals when you need support",
      demo: "Schedule sessions with verified therapists"
    },
    {
      icon: UserCheck,
      title: "Hire Human Friends", 
      description: "Find compassionate listeners for emotional support",
      demo: "Connect with trained peer supporters"
    },
    {
      icon: BookOpen,
      title: "Personal Journal",
      description: "Track your thoughts and emotions in a safe space",
      demo: "Daily reflections & mood tracking"
    },
    {
      icon: Shield,
      title: "Instant Panic Relief",
      description: "Quick access to calming techniques and emergency support",
      demo: "Breathing exercises & crisis hotlines"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            How Rant Works - Interactive Demo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {features.map((feature, index) => (
            <Card key={feature.title} className="gradient-card border-0 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                    
                    {feature.options && (
                      <div className="flex gap-2 flex-wrap">
                        {feature.options.map((option) => (
                          <Badge 
                            key={option.label} 
                            variant="secondary" 
                            className="flex items-center gap-1 px-3 py-1"
                          >
                            <option.icon className="w-3 h-3" />
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {feature.demo && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <span className="text-sm font-medium text-primary">Demo: </span>
                        <span className="text-sm text-muted-foreground">{feature.demo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center pt-6 border-t">
            <p className="text-muted-foreground mb-4">
              Ready to start your mental wellness journey?
            </p>
            <Button 
              size="lg" 
              variant="wellness"
              className="text-lg px-8 py-6"
              onClick={() => onOpenChange(false)}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;