import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPreview {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

// Blog previews
const blogPreviews: BlogPreview[] = [
  {
    id: "1",
    title: "Day 1: Why Getting Stuff Off Your Chest Is Good for You",
    excerpt: "We all have stuff we're dealing with—work stress, personal problems, thoughts we can't shake. When you keep it all inside, it just builds up.",
    date: "2026-01-08",
    readTime: "4 min",
    category: "Self Improvement",
  },
  {
    id: "2",
    title: "Day 2: Should You Vent or Keep It In?",
    excerpt: "Keeping emotions bottled up can cause bad mood, tiredness, and worry. But venting the right way helps you feel understood and think clearer.",
    date: "2026-01-09",
    readTime: "3 min",
    category: "Wellness Tips",
  },
  {
    id: "3",
    title: "Day 3: Does Venting Anonymously Help Your Mental Health?",
    excerpt: "Being anonymous lets you be emotionally free without worrying about judgment. Discover how anonymous venting can help your mental wellness.",
    date: "2026-01-10",
    readTime: "3 min",
    category: "Community",
  },
  {
    id: "4",
    title: "Day 4: Turn Your Rants Into Something Useful",
    excerpt: "Every rant has something to teach you – maybe about your limits, what stresses you out, or what you really need. Transform venting into growth.",
    date: "2026-01-11",
    readTime: "4 min",
    category: "Self Improvement",
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-24 bg-muted/30" aria-labelledby="blog-section-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Wellness Blog
          </div>
          <h2 id="blog-section-heading" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Insights for Your
            <span className="text-primary block">Mental Wellness Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Explore expert advice, practical tips, and inspiring stories to support your path to better mental health.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {blogPreviews.map((post, index) => (
            <article 
              key={post.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Link to={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:shadow-glow transition-all duration-300 border-0 shadow-card group hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <Badge variant="secondary" className="w-fit mb-2 text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </time>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full group">
            <Link to="/blog" target="_blank" rel="noopener noreferrer">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;