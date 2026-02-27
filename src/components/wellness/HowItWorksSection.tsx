import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Heart, LineChart, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up in seconds with email, Google, or Apple. Your journey begins here.",
    step: "01"
  },
  {
    icon: Heart,
    title: "Share Your Feelings",
    description: "Express yourself freely through journal entries, voice notes, or rants—public or private.",
    step: "02"
  },
  {
    icon: LineChart,
    title: "Track Your Progress",
    description: "Monitor your mood, build healthy habits, and see your growth over time.",
    step: "03"
  },
  {
    icon: Sparkles,
    title: "Get Support",
    description: "Connect with our AI companion Kai, join community circles, or book professional help.",
    step: "04"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-soft">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            How RantFree Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your path to mental wellness, simplified in four easy steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-border bg-card hover:shadow-glow transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10" aria-hidden="true">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
