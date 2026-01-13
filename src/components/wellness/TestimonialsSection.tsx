import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Professional",
    content: "This app has completely transformed how I manage stress. The daily mood tracking helped me identify patterns I never noticed before.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Student",
    content: "The guided meditation sessions are incredible. I've been sleeping better and feeling more focused during my studies.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Therapist",
    content: "I recommend this platform to my clients. The evidence-based approach and professional support integration is outstanding.",
    rating: 5,
    avatar: "ER"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Trusted by Thousands
            <span className="text-primary block">Improving Daily</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Real stories from people who have transformed their mental wellness journey with RantFree.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="shadow-card border-0 hover:shadow-glow transition-all duration-300 animate-scale-in"
              style={{animationDelay: `${index * 150}ms`}}
            >
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 text-balance italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span>4.9/5 Rating</span>
            </div>
            <div>•</div>
            <div>10,000+ Active Users</div>
            <div>•</div>
            <div>98% Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;