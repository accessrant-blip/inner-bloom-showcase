import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, Calendar, UserCheck, BookOpen, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Express Freely",
    description: "Post rants publicly, anonymously, or privately. Your choice, your voice, your way.",
    gradient: "from-primary to-primary-glow"
  },
  {
    icon: Calendar,
    title: "Book Therapists",
    description: "Connect with licensed professionals on your schedule. Quality care when you need it.",
    gradient: "from-secondary to-secondary-accent"
  },
  {
    icon: UserCheck,
    title: "Human Friends",
    description: "Hire compassionate listeners for emotional support and genuine connections.",
    gradient: "from-accent to-accent"
  },
  {
    icon: BookOpen,
    title: "Personal Journal",
    description: "Track your thoughts, emotions, and progress in a secure, private space.",
    gradient: "from-primary to-secondary"
  },
  {
    icon: Shield,
    title: "Panic Relief",
    description: "Instant access to calming techniques, breathing exercises, and crisis support.",
    gradient: "from-accent to-primary"
  },
  {
    icon: Zap,
    title: "AI Insights",
    description: "Get personalized recommendations based on your mood patterns and journey.",
    gradient: "from-secondary to-accent"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 gradient-soft relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powerful Features</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Everything You Need for
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Complete Mental Wellness
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            A comprehensive platform designed with your mental health in mind, combining professional support with innovative tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="glass border-border/50 hover:border-primary/50 group hover:shadow-neon transition-all duration-500 animate-scale-in overflow-hidden relative"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardHeader className="text-center pb-4 relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-balance group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </CardHeader>
              
              <CardContent className="text-center relative z-10">
                <p className="text-muted-foreground text-balance leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
