import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Professional",
    content: "Rant completely changed how I deal with stress. The anonymous posting feature let me express myself without fear, and booking a therapist was seamless.",
    rating: 5,
    avatar: "SJ",
    color: "from-primary to-primary-glow"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content: "The panic relief feature saved me during a crisis. Having instant access to calming techniques and the ability to connect with support was life-changing.",
    rating: 5,
    avatar: "MC",
    color: "from-secondary to-secondary-accent"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Clinical Psychologist",
    content: "As a therapist, I recommend Rant to my clients. The journal feature combined with professional support creates a perfect ecosystem for healing.",
    rating: 5,
    avatar: "ER",
    color: "from-accent to-accent"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-32 gradient-mesh relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="text-sm text-muted-foreground">Testimonials</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Loved by Thousands
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Improving Every Day
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Real stories from real people who transformed their mental wellness journey with Rant.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="glass border-border/50 hover:border-primary/50 group hover:shadow-neon transition-all duration-500 animate-scale-in relative overflow-hidden"
              style={{animationDelay: `${index * 150}ms`}}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardContent className="p-8 relative z-10">
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 text-balance leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center pt-4 border-t border-border/50">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center mr-4 shadow-glow`}>
                    <span className="text-white font-bold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-8 px-8 py-4 glass rounded-full border border-border/50">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <span className="font-semibold">4.9/5</span>
              <span className="text-muted-foreground text-sm">Rating</span>
            </div>
            <div className="w-px h-6 bg-border/50"></div>
            <div>
              <span className="font-semibold">10,000+</span>
              <span className="text-muted-foreground text-sm ml-2">Active Users</span>
            </div>
            <div className="w-px h-6 bg-border/50"></div>
            <div>
              <span className="font-semibold">98%</span>
              <span className="text-muted-foreground text-sm ml-2">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
