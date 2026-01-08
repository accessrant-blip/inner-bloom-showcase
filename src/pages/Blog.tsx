import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
}

// Sample blog posts - these would typically come from a database
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Simple Breathing Techniques to Calm Your Mind",
    excerpt: "Discover proven breathing exercises that can help reduce anxiety and bring peace to your daily life. These techniques are backed by science and easy to practice anywhere.",
    content: "",
    author: "RantFree Team",
    date: "2026-01-08",
    readTime: "5 min read",
    category: "Wellness Tips",
    tags: ["breathing", "anxiety", "mindfulness"],
    featured: true,
  },
  {
    id: "2",
    title: "Understanding the Power of Journaling for Mental Health",
    excerpt: "Learn how putting your thoughts on paper can transform your emotional well-being and help you process difficult experiences.",
    content: "",
    author: "RantFree Team",
    date: "2026-01-06",
    readTime: "7 min read",
    category: "Mental Health",
    tags: ["journaling", "self-care", "therapy"],
    featured: false,
  },
  {
    id: "3",
    title: "Building Healthy Habits: A Step-by-Step Guide",
    excerpt: "Creating lasting positive habits doesn't have to be overwhelming. Here's a practical approach to building routines that stick.",
    content: "",
    author: "RantFree Team",
    date: "2026-01-04",
    readTime: "6 min read",
    category: "Self Improvement",
    tags: ["habits", "productivity", "wellness"],
    featured: false,
  },
  {
    id: "4",
    title: "The Science Behind Gratitude and Happiness",
    excerpt: "Explore the research that shows how practicing gratitude can rewire your brain for positivity and improve your overall life satisfaction.",
    content: "",
    author: "RantFree Team",
    date: "2026-01-02",
    readTime: "8 min read",
    category: "Mental Health",
    tags: ["gratitude", "happiness", "neuroscience"],
    featured: true,
  },
  {
    id: "5",
    title: "Dealing with Stress in a Fast-Paced World",
    excerpt: "Modern life can be overwhelming. Learn practical strategies to manage stress and maintain your mental equilibrium.",
    content: "",
    author: "RantFree Team",
    date: "2025-12-30",
    readTime: "6 min read",
    category: "Wellness Tips",
    tags: ["stress", "work-life balance", "relaxation"],
    featured: false,
  },
  {
    id: "6",
    title: "Why Connection Matters: The Importance of Community",
    excerpt: "Humans are social beings. Discover why building meaningful connections is essential for your mental health and how to nurture relationships.",
    content: "",
    author: "RantFree Team",
    date: "2025-12-28",
    readTime: "5 min read",
    category: "Community",
    tags: ["connection", "relationships", "support"],
    featured: false,
  },
];

const categories = ["All", "Wellness Tips", "Mental Health", "Self Improvement", "Community"];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags are handled in index.html, but we add semantic structure */}
      
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-foreground">RantFree Blog</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12" aria-labelledby="blog-heading">
          <h2 id="blog-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Wellness Insights & <span className="text-primary">Mental Health Tips</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our collection of articles on mental wellness, self-care practices, and personal growth.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-full"
              aria-label="Search blog posts"
            />
          </div>
        </section>

        {/* Category Filter */}
        <nav className="mb-8 overflow-x-auto pb-2" aria-label="Blog categories">
          <div className="flex gap-2 justify-center flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </nav>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12" aria-labelledby="featured-heading">
            <h3 id="featured-heading" className="text-2xl font-semibold mb-6 text-foreground">
              Featured Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <article key={post.id}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader className="pb-3">
                      <Badge variant="secondary" className="w-fit mb-2">
                        {post.category}
                      </Badge>
                      <h4 className="text-xl font-semibold text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </time>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section aria-labelledby="all-posts-heading">
          <h3 id="all-posts-heading" className="text-2xl font-semibold mb-6 text-foreground">
            {selectedCategory === "All" ? "All Articles" : selectedCategory}
          </h3>
          
          {regularPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <article key={post.id}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <Badge variant="secondary" className="w-fit mb-2">
                        {post.category}
                      </Badge>
                      <h4 className="text-lg font-semibold text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your search.</p>
              <Button 
                variant="link" 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16 bg-card rounded-2xl p-8 md:p-12 text-center border border-border" aria-labelledby="newsletter-heading">
          <h3 id="newsletter-heading" className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Stay Updated on Wellness Tips
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Get the latest mental health insights and self-care strategies delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 rounded-full flex-1"
              aria-label="Email for newsletter"
            />
            <Button className="h-12 px-8 rounded-full">
              Subscribe
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} RantFree. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;