import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Users, Shield, MessageCircle, Calendar } from "lucide-react";
import featuresImage from "@/assets/features-illustration.jpg";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Personalized recommendations based on your mood patterns and progress tracking."
  },
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Daily check-ins and emotional awareness tools to understand your mental state."
  },
  {
    icon: Users,
    title: "Professional Support", 
    description: "Connect with licensed therapists and counselors when you need guidance."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and secure. We never share your personal information."
  },
  {
    icon: MessageCircle,
    title: "Community Support",
    description: "Join supportive communities and connect with others on similar wellness journeys."
  },
  {
    icon: Calendar,
    title: "Guided Programs",
    description: "Structured meditation, CBT exercises, and mindfulness programs."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 gradient-soft">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Everything You Need for
            <span className="text-primary block">Better Mental Health</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Our comprehensive platform combines evidence-based techniques with modern technology 
            to support your mental wellness journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="gradient-card shadow-card border-0 hover:shadow-glow transition-all duration-300 animate-scale-in"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-balance">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-balance">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center">
          <div className="max-w-md mx-auto animate-float">
            <img 
              src={featuresImage} 
              alt="Mental health app features illustration"
              className="w-full h-auto rounded-2xl shadow-glow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;