import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

// Blog posts data - shared with Blog.tsx
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Day 1: Why Getting Stuff Off Your Chest Is Good for You 💭",
    excerpt: "We all have stuff we're dealing with—work stress, personal problems, thoughts we can't shake. When you keep it all inside, it just builds up. Talking about it, if you do it right, can really take the pressure off.",
    content: `We all have stuff we're dealing with—work stress, personal problems, thoughts we can't shake. When you keep it all inside, it just builds up. Talking about it, if you do it right, can really take the pressure off.

## 🤔 Why Does It Work?

Turns out, talking about your feelings can:

- ✅ **Lower stress and worry**
- ✅ **Help you understand your feelings better**
- ✅ **Stop you from burning out emotionally**
- ✅ **Help you know yourself better**

Writing or talking things out helps your brain deal with stuff instead of just ignoring it.

## ⚖️ Good Venting vs. Bad Venting

### 👍 Good venting:

- Is about saying how you feel, **not blaming others**
- Makes you feel **better afterward**
- Makes you **think about things**

### 👎 Bad venting:

- Just keeps going over the same angry stuff without helping
- Makes things seem even worse

That's why having a **safe place** to vent matters.

## 🌟 How RantFree.in Can Help?

RantFree.in gives you a safe space where you can:

- 🔒 **Vent without anyone knowing it's you**
- 💬 **Say how you feel without being judged**
- 😮‍💨 **Let off steam without worrying about what people think**

It's not just about complaining—it's about **getting it out**.

## 💡 One Last Thing!

You don't have to handle everything by yourself. Venting isn't a weakness—it's just **taking care of yourself**.

👉 **Got a lot on your mind? Try writing an anonymous rant on RantFree.in today.**`,
    author: "RantFree Team",
    date: "2026-01-08",
    readTime: "4 min read",
    category: "Self Improvement",
    tags: ["venting", "mental health", "self-care", "emotional wellness"],
    featured: true,
  },
  {
    id: "2",
    title: "Day 2: Should You Vent or Keep It In? 🤷‍♀️",
    excerpt: "Keeping emotions bottled up can cause bad mood, tiredness, and worry. But venting the right way helps you feel understood and think clearer. Find the balance!",
    content: `## 🚫 Keeping Emotions Bottled Up

If you don't deal with your feelings, they might cause:

- 😔 **Bad mood**
- 😴 **Tiredness**
- 😰 **Worry**
- 💥 **Unexpected angry reactions**

Pretending feelings aren't there **doesn't make them vanish**.

## 💬 Why It's Better to Vent

Venting helps you:

- 🤗 **Feel understood**
- 🧠 **Think clearer**
- 😌 **Feel less stressed**

Just make sure you vent in a way that **doesn't hurt yourself or others**.

## 🔐 How Anonymous Venting Can Help

Some people don't vent because they:

- 😟 **Worry about being judged**
- 😨 **Are scared of what others will think**
- 😕 **Feel misunderstood**

Sites like **RantFree.in** fix this by letting you express yourself without anyone knowing who you are, which makes it easier to be **honest**.

## ⚖️ Finding the Middle Ground

The best way to deal with feelings is to:

- 🗣️ **Say how you feel**
- 🤔 **Think about why you feel that way**
- 📚 **Learn from your feelings**

## 💡 In Conclusion

If holding in your emotions feels like **holding your breath**, venting is like **finally breathing out**.

👉 **Need a safe place to rant? Check out RantFree.in.**`,
    author: "RantFree Team",
    date: "2026-01-09",
    readTime: "3 min read",
    category: "Wellness Tips",
    tags: ["venting", "emotional health", "self-expression", "mental wellness"],
    featured: false,
  },
  {
    id: "3",
    title: "📝 Day 3: Does Venting Anonymously Help Your Mental Health?",
    excerpt: "Being anonymous lets you be emotionally free without worrying about judgment. Discover how anonymous venting can lower worry levels and help you let go of feelings.",
    content: `## 🎭 Why Go Anonymous?

Being anonymous means:

- 🙈 **You don't worry about being judged**
- 💪 **You don't have to act tough**
- ✅ **There are no social risks**
- 🦋 **It lets you be emotionally free**

## 🧠 How It Helps Your Head

Venting anonymously can:

- 💯 **Make you more honest**
- 😌 **Lower your worry levels**
- 🎈 **Help you let go of feelings**
- ⚡ **Help people share quicker**

## ✨ When It's a Good Idea

It's best when:

- 💨 **You just need to let off steam**
- 🤔 **You need to think clearly**
- 🚶 **You're not ready to see a therapist**

## 🏠 RantFree.in: A Safe Place to Rant

**RantFree.in** gives you a private, caring place to say what you feel without being taken advantage of.

It's great if you're:

- 🙊 **Shy**
- 🌱 **New to venting**
- 😩 **Stressed out daily**

## 💡 To Wrap Up

Sometimes, feeling better starts with **someone listening**—even if they don't know who you are.

👉 **Vent safely. Vent freely. Try RantFree.in.**`,
    author: "RantFree Team",
    date: "2026-01-10",
    readTime: "3 min read",
    category: "Community",
    tags: ["anonymous venting", "mental health", "community support", "emotional wellness"],
    featured: false,
  },
  {
    id: "4",
    title: "📝 Day 4: Turn Your Rants Into Something Useful",
    excerpt: "Every rant has something to teach you – maybe about your limits, what stresses you out, or what you really need. Learn how to transform venting into personal growth.",
    content: `Ranting isn't just about letting off steam—it can be a **powerful tool for self-discovery** when done right. Here's how to turn your emotional outbursts into meaningful insights.

## ✍️ Step 1: Just Write It All Out

Don't hold back. Let your feelings **spill onto the page** without judgment:

- 🔥 **No filtering** — say exactly what you feel
- 🚫 **No editing** — don't worry about grammar or making sense
- 💨 **No fixing** — this isn't problem-solving time yet
- 🙅 **No judging yourself** — all feelings are valid

The goal is pure, unfiltered expression.

## 🔍 Step 2: Read It Again, But Try to Understand

Once you've let it all out, take a step back and **read your rant with curiosity**:

Ask yourself these questions:

- 🤔 **What made me so mad?** — Identify the trigger
- 💢 **What's the strongest feeling here?** — Name the emotion
- ❓ **What did I really need in that moment?** — Discover unmet needs
- 🔄 **Is this a pattern?** — Notice recurring themes

## 🌱 Step 3: Find What You Can Learn

Every rant has **hidden wisdom** waiting to be discovered:

- 📍 **Your limits** — What boundaries were crossed?
- 😰 **Your stressors** — What consistently bothers you?
- 💡 **Your needs** — What do you actually want?
- 🎯 **Your values** — What matters most to you?

Transform complaints into **actionable insights**.

## 🚀 Use RantFree.in to Think Things Through

**RantFree.in** helps you through this entire process:

- ✅ **Get it all out first** — Safe, anonymous venting space
- 🧠 **Think about it later** — Review your rants with fresh eyes
- 📊 **See how your feelings change over time** — Track your emotional patterns
- 🤖 **Get AI insights** — Kai can help you find meaning in your words

## 💪 You Grow When You Know Yourself

Here's the truth:

- 🎈 **Ranting helps you let go** — Release the emotional pressure
- 📈 **Thinking about it helps you get better** — Turn pain into progress
- 🌟 **Self-awareness is the first step to change** — Know yourself deeply

The combination of **emotional release** and **thoughtful reflection** is incredibly powerful for personal growth.

## 💡 Your Next Step

Ready to turn your frustrations into fuel for growth?

👉 **Start journaling your rants on RantFree.in today and watch yourself transform.**`,
    author: "RantFree Team",
    date: "2026-01-11",
    readTime: "4 min read",
    category: "Self Improvement",
    tags: ["personal growth", "self-reflection", "journaling", "emotional intelligence"],
    featured: false,
  },
  {
    id: "5",
    title: "💔 Feeling Lonely Can Seriously Hurt Your Health",
    excerpt: "We usually think of loneliness as just feeling down. But research shows it could be a bigger deal than that—it might actually shorten your life.",
    content: `We usually think of loneliness as just **feeling down**. But research shows it could be a **bigger deal** than that.

## 📊 What the Research Says

A big study by **Holt-Lunstad and others in 2015** looked at a bunch of long-term studies. They saw that feeling lonely and being isolated can mean you're more likely to die earlier.

**Bottom line:** If you're lonely or don't have good friends, you might not live as long as someone who feels connected.

## 🤔 Loneliness and Being Alone Aren't the Same

Here's the difference:

- 😔 **Lonely** = feeling apart from others even if you're around people
- 🏠 **Being alone** = not having many friends or talking to people much

**Important:** Being alone doesn't mean you're lonely. You can live solo and still feel close to others.

## ⚠️ Why Loneliness Is Bad for You

Feeling lonely all the time can:

- 😰 **Stress out your body** — high cortisol levels
- 😴 **Mess up your sleep** — harder to rest well
- 🔥 **Cause inflammation** — your body stays on alert
- 🚫 **Make you do unhealthy stuff** — bad habits, not moving, skipping doctors

## 💪 What to Do About It

You don't need a ton of buddies. What counts is having **real bonds**.

### ✨ Easy things to try:

- 📱 **Text a friend today** — just say hi!
- 🤝 **Join a group that meets often** — sports, volunteering, local events
- 💎 **Focus on quality over quantity** — one or two good friends beats a lot of acquaintances

## 💡 The Takeaway

Loneliness isn't a flaw; it's your body **telling you something's up**. And being connected to others is one of the **best things you can do for your health**.

👉 **Need a place to connect? Join supportive communities on RantFree.in and start building meaningful connections.**`,
    author: "RantFree Team",
    date: "2026-01-12",
    readTime: "4 min read",
    category: "Community",
    tags: ["loneliness", "mental health", "social connection", "wellness research"],
    featured: false,
  },
  {
    id: "6",
    title: "🌙 Why Sleep is Great for Your Mental State + Tips to Doze Off Quickly",
    excerpt: "Sleep isn't just about taking a break. It's when your brain gets a daily reset. If you're dealing with stress, worry, feeling down, or can't stop thinking, getting better sleep can really help.",
    content: `Sleep isn't just about taking a break. It's when your brain gets a **daily reset**. If you're dealing with stress, worry, feeling down, or can't stop thinking, getting better sleep can really help.

This short guide tells you why sleep is so important and simple ways to fall asleep faster.

## 🌙 How Sleep Helps Your Mental State

### 1) Less anxiety and overthinking

Not sleeping well can keep your brain on **high alert**, making you worry more. Good sleep settles things down.

### 2) Better mood

When you sleep well, you feel more **stable**. You're less likely to feel annoyed, stressed, or worn out.

### 3) More focus and get more done

Sleep helps your **memory**, **focus**, and how you make choices — so you can get stuff done without feeling tired.

### 4) Stronger emotions

Good sleep makes it easier to **deal with tough times** and bounce back from bad days.

## ✅ Quick Ways to Fall Asleep (Simple Tricks)

### 1) Try 4-7-8 breathing

- 🌬️ **Breathe in** for 4 seconds
- ⏸️ **Hold** for 7 seconds
- 💨 **Breathe out** for 8 seconds
- 🔁 **Do this 4 times**

### 2) Quickly "Brain Dump"

Spend **2 minutes** writing down worries and to-do's. This clears your head.

### 3) Stay off your phone before bed

Looking at your phone **wakes up your brain** and makes it harder to sleep.

### 4) Keep your room cold

A **cold room** helps you fall asleep faster.

### 5) Try calming sounds / sleep meditation

**Rain sounds**, quiet noise, or a short sleep meditation can calm you down.

## ⭐ Quick 10-Minute Bedtime Plan

- ✍️ **2 minutes** of writing in a journal
- 🌬️ **4 rounds** of that breathing thing
- 🧘 **5 minutes** of sleep meditation
- 📴 **Lights off**, phone away

## ✅ The Bottom Line

Better sleep makes you feel **happier**, **less worried**, and **better mentally**. Start small — just one simple thing each night can make a difference.

👉 **Try our Breathe With Me tool or use the Journal Space on RantFree to wind down before bed!**`,
    author: "RantFree Team",
    date: "2026-01-12",
    readTime: "4 min read",
    category: "Self Improvement",
    tags: ["sleep", "mental health", "anxiety relief", "wellness tips", "bedtime routine"],
    featured: false,
  },
  {
    id: "7",
    title: "🎧 Sad Songs on Repeat: What They Do to Your Head (The Real Deal)",
    excerpt: "We all do it – listen to sad songs over and over, especially when we're dealing with heartbreak, loneliness, or stress. It might seem random, but there's a reason we do it – it's all in your head.",
    content: `We all do it – listen to sad songs over and over, especially when we're dealing with:

- 💔 A **broken heart**
- 😔 Feeling **alone**
- 😰 **Stressed**
- 😢 Sad about **loss**
- 🔥 Completely **burnt out**
- 🌧️ **Down in the dumps**

It might seem random, but there's a reason we do it – it's all in your head.

## 🧠 Why Can't We Stop Replaying Those Sad Tunes?

### 1) Your brain wants to know it's not alone

When you're feeling low, your brain isn't looking for a pep talk. It wants someone to **get it**. Sad songs are like:

- 👋 *"Hey, you're not the only one."*
- 🤝 *"Someone else gets how this feels."*
- ✅ *"Okay, this pain makes sense."*

That can **chill things out** for a bit.

### 2) They help you make sense of the mess inside

Sometimes feelings are like a **jumbled mess**:

- 🤷 You can't put your finger on them
- 🏷️ You can't name them
- 😶 You just can't get them out

The words in songs can give your emotions a **shape**, and your brain's like: *"Yes! I get it now."*

### 3) They let you feel sad in a safe way

Here's the crazy part: Sad music can make you feel down **without anything bad actually happening**, so you're feeling it but in a **controlled way** (the music). It's way less scary than dealing with the real stuff.

## ✅ What Happens in Your Brain When the Music's Sad?

Sad music messes with a few systems:

### A) The happy center (dopamine) 🧪

Even sad songs can give you a little hit of **dopamine**, especially if you love the song. This starts a loop:

**feeling down → song → a little comfort → repeat**

That's how it gets **addicting**.

### B) Memory lane 🛤️

Music and memories are tight. So playing those sad songs can:

- 📸 Bring back **old times**
- 👤 Remind you of **specific people**
- 🌅 Make you **super nostalgic**
- 💗 Turn up the **feels**

That's why a breakup and sad songs are such a tough mix.

### C) Your nerves 🧘

Slow, sad songs usually **calm your body down**. Think: slower breathing, slower heartbeat, and a calmer you. So even if the song's a downer, your body might feel **at ease**.

## 🌧️ Is it Helping or Hurting? Two Ways It Goes

### ✅ 1) When it's making you feel better

Sad songs are **good** when they:

- **💧 Let you get it out** — Crying is like a reset for your nerves. It helps you when you're feeling overwhelmed.
- **🕊️ Help you deal with loss** — Sad songs let you accept how you're feeling instead of pushing it down.
- **🤗 Make you feel like you're not alone** — Even when you're by yourself, music can make you feel like you're connected to something.
- **🧩 Help you figure things out** — Your brain starts going: *"Okay, this happened, it hurt, but I'm going to get through it."* That's how sadness can help you heal.

### ⚠️ 2) When it's making things worse

Sad songs are **bad news** when they get you stuck:

- **🔄 Thinking in circles** — Like, *"Why me?"* or *"What if I did this?"* or *"I'm never going to find someone."* Then those bad thought patterns get even worse.
- **🚫 Feeling like there's no way out** — Lyrics like: *"I'm broken"*, *"It's never going to get better"*, or *"I'm not good enough"* can become what you start telling yourself if you hear them enough.
- **😞 Just staying sad** — You get used to feeling down and don't try to feel better. That's how people get stuck in a rut.

## 🧩 Here's the Thing: Not all sad music is the same

### ✅ The Good Kind:

- 💚 Knows that things **hurt**
- 🎯 Means **something**
- 🌈 Ends with a little bit of **hope or strength**

### ⚠️ The Bad Kind:

- 😔 Keeps saying there's **nothing you can do**
- 💀 Makes feeling bad seem **cool**
- 😣 Makes you **hate yourself more**
- ⛓️ Makes you think you're **doomed**

Your brain **soaks up** what it hears over and over.

## 🔥 What You Might Notice (How It Messes With You)

### Short-Term (Minutes to Hours):

- ✅ You feel like you got something off your chest
- 😌 Feeling calm
- 😢 Crying and feeling better
- 🔙 Feeling that old feeling come back
- 📉 Your mood drops

### Long-Term (Days to Weeks) if you do it a lot:

- 🎭 You get more **sensitive**
- 🐌 It's harder to **get going**
- 📸 You get super attached to **old memories**
- 🗣️ You start **beating yourself up** more in your head
- 😴 **Harder to sleep** (if you listen at night)
- 🌀 You start thinking like you're **depressed**

## ✅ Quick Check: Is it Helping or Hurting You?

Ask yourself after you listen:

### 💚 Signs it's helping:

- 😌 *"I feel calmer."*
- 💨 *"I got some feels out."*
- ✨ *"I feel lighter after."*
- 🌱 *"I'm still doing my thing and feeling hopeful."*

### ⚠️ Signs it's hurting:

- 📉 *"I feel worse every time."*
- 🔁 *"I can't stop hitting replay."*
- 🔙 *"I just keep thinking about the past."*
- 🏠 *"I'm hiding away more."*
- 😔 *"It makes me feel like there's no hope."*

## ⭐ A Smart Move: The Feelings Playlist

Three types of playlists:

- 🌧️ **Feel it** (sad songs, 20 minutes max)
- 🌿 **Heal it** (chill, calm songs)
- ☀️ **Shift it** (hopeful, upbeat songs)

That'll keep you from getting stuck.

## ✅ The Best Way to Listen (The Safe Way)

### The 20-5-10 Rule:

- ⏱️ **20 minutes** of sad songs
- 📝 **5 minutes** to think it over (write it down or just breathe)
- 🎵 **10 minutes** of music that chills you out or lifts you up

That teaches your brain to: **feel it → deal with it → get back on track**.

## 💭 One Last Thought

Sad songs can be:

🎧 **Like talking to a therapist**

or

🎧 **Like sinking in quicksand**

It's not really about the music. It's about **how you use it**.

👉 **Check out our Breathe With Me tool or Journal Space on RantFree to help process those feelings in a healthy way!**`,
    author: "RantFree Team",
    date: "2026-01-12",
    readTime: "8 min read",
    category: "Mental Health",
    tags: ["sad songs", "mental health", "music therapy", "emotional wellness", "coping strategies"],
    featured: false,
  },
];

// Markdown-like content renderer
const renderContent = (content: string) => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="space-y-2 my-4 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-foreground/90 leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInlineText(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const formatInlineText = (text: string): string => {
    // Bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
    return text;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Empty line
    if (!trimmedLine) {
      flushList();
      return;
    }

    // H2 heading
    if (trimmedLine.startsWith('## ')) {
      flushList();
      const headingText = trimmedLine.replace('## ', '');
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
          {headingText}
        </h2>
      );
      return;
    }

    // H3 heading
    if (trimmedLine.startsWith('### ')) {
      flushList();
      const headingText = trimmedLine.replace('### ', '');
      elements.push(
        <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
          {headingText}
        </h3>
      );
      return;
    }

    // List item
    if (trimmedLine.startsWith('- ')) {
      const itemText = trimmedLine.replace('- ', '');
      listItems.push(itemText);
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p 
        key={index} 
        className="text-foreground/90 leading-relaxed my-4"
        dangerouslySetInnerHTML={{ __html: formatInlineText(trimmedLine) }}
      />
    );
  });

  flushList();
  return elements;
};

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
    }
  };

  // Related posts (excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Blog</span>
            </Link>
            <Button variant="outline" size="sm" onClick={handleShare} className="rounded-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <article className="max-w-3xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Ready to Let It Out? 💬
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands who've found relief through anonymous venting on RantFree.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-full" onClick={() => navigate('/rant')}>
                Start Ranting Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" onClick={() => navigate('/auth')}>
                Create Free Account
              </Button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-3xl mx-auto mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Related Articles
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.id}`}
                  className="group"
                >
                  <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
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

export default BlogPostPage;
