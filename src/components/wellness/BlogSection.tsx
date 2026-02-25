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
    id: "brain-replays-old-conversations",
    title: "Why Your Brain Replays Old Conversations (And Why You Can't Just \"Stop Thinking About It\") 🧠💬",
    excerpt: "You're trying to relax, then out of nowhere your brain drags up some old talk. You start replaying what you said, thinking about what you should have said instead. There's actually a reason for it.",
    date: "2026-02-25",
    readTime: "10 min",
    category: "Community",
  },
  {
    id: "nervous-system-personality",
    title: "Your Nervous System Has a Personality: Why You React the Way You Do 🧠",
    excerpt: "Ever wonder why people react so differently to the same situation? A lot of what we think of as personality is actually based on how our nervous system handles feelings of safety and danger.",
    date: "2026-02-24",
    readTime: "10 min",
    category: "Mental Health",
  },
  {
    id: "emotional-hangover",
    title: "The Emotional Hangover No One Talks About 😶‍🌫️",
    excerpt: "You know when you wake up and just feel… blah? Not exactly sad, but just heavy? There's a name for that: an emotional hangover.",
    date: "2026-02-23",
    readTime: "8 min",
    category: "Mental Health",
  },
  {
    id: "gut-emotions-connected",
    title: "Your Gut & Your Emotions Are Connected 🧠🦠",
    excerpt: "Most people assume emotions are all in your head. But science says your gut and brain are always chatting with each other.",
    date: "2026-02-22",
    readTime: "6 min",
    category: "Self Improvement",
  },
  {
    id: "building-habits-that-stick",
    title: "10 Proven Ways to Build Habits That Actually Stick 🧠",
    excerpt: "Building habits isn't about trying hard. Studies show that habits come from doing things regularly in a steady situation, not from sudden bursts of motivation.",
    date: "2026-02-21",
    readTime: "8 min",
    category: "Self Improvement",
  },
  {
    id: "loneliness-men-dont-talk-about",
    title: "The Loneliness Men Don't Talk About 🤐",
    excerpt: "There's a certain kind of loneliness that's hard to spot. It looks like going to work like always, answering emails, and saying you're fine. A lot of guys are dealing with it silently.",
    date: "2026-02-20",
    readTime: "9 min",
    category: "Community",
  },
  {
    id: "decoding-mood-swings-menstrual-cycle",
    title: "Decoding Your Mood Swings: It's All About Your Menstrual Cycle 🌙",
    excerpt: "Ever wonder why you feel like you can conquer the world one week, but just want to hide under the covers the next? It's not random — it's your hormones doing their thing.",
    date: "2026-02-19",
    readTime: "8 min",
    category: "Community",
  },
  {
    id: "10-things-to-say-to-help",
    title: "Here Are 10 Things You Can Say to Help Someone Feel Better 💬",
    excerpt: "When someone you care about is having a tough time, you want to say the right thing. But most people aren't looking for perfect advice — they just need words that feel safe and real.",
    date: "2026-02-18",
    readTime: "5 min",
    category: "Community",
  },
  {
    id: "growth-vs-self-pressure",
    title: "The Difference Between Growth and Self-Pressure 🌱",
    excerpt: "Self-improvement is everywhere. But when does healthy growth cross the line into self-pressure? Here's how to tell the difference.",
    date: "2026-02-17",
    readTime: "7 min",
    category: "Self Improvement",
  },
  {
    id: "fine-during-day-fall-apart-at-night",
    title: "Why You Feel Fine During the Day But Fall Apart at Night 🌙",
    excerpt: "You get through the day just fine. Then night comes, the house gets quiet, and everything feels heavy. There are real reasons why this happens.",
    date: "2026-02-17",
    readTime: "6 min",
    category: "Mental Health",
  },
  {
    id: "duality-of-healing",
    title: "The Duality of Healing: Why You Can Be Growing and Struggling at the Same Time 🌿",
    excerpt: "Healing isn't a straight line. You can feel stronger and still be sad. That doesn't mean you're failing — it means you're human.",
    date: "2026-02-16",
    readTime: "7 min",
    category: "Mental Health",
  },
  {
    id: "abandoning-yourself",
    title: "The Day You Realize You've Been Abandoning Yourself 💛",
    excerpt: "You're not tired just because life's tough. You're beat because you haven't been taking care of yourself. Not all at once, but little by little.",
    date: "2026-02-15",
    readTime: "7 min",
    category: "Wellness Tips",
  },
  {
    id: "helping-a-friend",
    title: "How to Help a Friend Who's Having a Tough Time (What to Say and What Not To) 💛",
    excerpt: "Most people don't need you to solve their problems. They just need someone who's there to listen and understand.",
    date: "2026-02-14",
    readTime: "6 min",
    category: "Community",
  },
  {
    id: "postpartum-depression",
    title: "Postpartum Depression: Understanding It, Talking About It, and Finding Your Way Through 💛",
    excerpt: "Postpartum depression isn't about failing as a parent. It's a real health issue, and there's help out there.",
    date: "2026-02-11",
    readTime: "8 min",
    category: "Community",
  },
  {
    id: "sit-with-your-feelings",
    title: "\"Sit With Your Feelings\": What Therapists Really Mean 🌿",
    excerpt: "Ever heard a therapist say 'sit with your feelings' and thought, 'Huh?' This post explains what they mean and what it doesn't mean.",
    date: "2026-02-10",
    readTime: "6 min",
    category: "Mental Health",
  },
  {
    id: "21",
    title: "10 Easy Journaling Tips (Plus Prompts to Get You Started) 📝",
    excerpt: "Journaling doesn't need to be a big deal to work. You don't have to write a lot, dig super deep, or make it perfect. All you need is honesty.",
    date: "2026-02-08",
    readTime: "4 min",
    category: "Wellness Tips",
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