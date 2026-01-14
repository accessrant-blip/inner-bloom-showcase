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
    id: "5",
    title: "🎤 Day 5: Time to Let It All Out – Rant Like a Pro",
    excerpt: "Want to rant the right way? Learn how to express yourself authentically without holding back. Discover why RantFree.in is the perfect no-judgment zone for your emotions.",
    content: `Ready to vent like you mean it? Here's how to do it **the right way** and why people are loving RantFree.in! 🚀

## 💡 Want to Rant the Right Way? Here's How:

- ✅ **Be real** — Don't filter yourself, authenticity is key
- ✅ **Talk about how *you* feel** — Focus on your emotions, not blaming others
- ✅ **Don't hold back those emotions!** — Let it all flow freely 💨

## 💜 Why People Trying Out Rants Love RantFree.in:

- 🙈 **It's a no-judgment zone** — Express freely without fear
- 🔒 **You don't have to say who you are** — Stay completely anonymous
- 🌊 **Just let your feelings flow** — No restrictions, just release

## 🌱 Start Easy

You don't need fancy words, just be **honest** with yourself. Your feelings are valid exactly as they are.

The first step is always the hardest, but once you start, you'll wonder why you waited so long! ✨

👉 **Start your first rant anonymously on RantFree.in right now!**`,
    author: "RantFree Team",
    date: "2026-01-12",
    readTime: "2 min read",
    category: "Community",
    tags: ["ranting", "emotional expression", "community", "anonymous venting"],
    featured: false,
  },
  {
    id: "day-7",
    title: "🌧️ Sadness vs. Depression: Spotting the Difference and Knowing When to Get Help",
    excerpt: "Feeling sad is part of life. But depression is something else. Learn to spot the real difference between sadness and depression, and know when it's time to seek help.",
    content: `Feeling sad is part of life. It happens when things get tough – like after a breakup, a loss, or just feeling stressed.

**But depression is something else.**

A lot of people mix up sadness and depression, which can lead to:

- 😔 **Ignoring symptoms** ("I'm just sad.")
- ⏰ **Waiting too long** to get help
- 😣 **Feeling bad** for not "just getting over it"

This will help you see the **real difference** between sadness and depression in a simple way.

## 🌧️ What's Sadness?

Sadness is a **normal feeling** when something bad happens.

There's usually a reason for it, like:

- 💔 **Heartbreak**
- ❌ **Failure**
- 😢 **Losing someone**
- 🙁 **Feeling alone**
- 😤 **Arguing**
- 😰 **Stress**

### What sadness feels like:

- 😞 Feeling down
- 😭 Wanting to cry or be comforted
- 😠 Being in a bad mood
- 🥺 Feeling sensitive
- 🚶 Needing to be alone

### ✨ Important: Sadness still lets you feel other things

Even when you're sad, you can still:

- 😄 **Laugh** at something
- 🌟 **Feel hopeful** sometimes
- 🎯 **Enjoy** small things
- 💭 **Get your mind off things** and feel a little better

Sadness comes and goes – and it usually **gets better with time and support**.

## 🕳️ What's Depression?

Depression **isn't just feeling sad**.

It's a mental health condition that changes how you:

- 🧠 **Think**
- 💭 **Feel**
- 🚶 **Act**
- 🏠 **Live your life**

Sometimes there's a reason for depression – but **not always**. People with depression often say:

> *"I don't even know why I feel this way."*

### What depression feels like:

- 😶 **Always feeling down** or empty
- 🫥 **Feeling numb** (even when you should be happy)
- 🌑 Feeling like **things will never get better**
- 😩 **Not wanting** to do anything
- 💔 **Not enjoying things** anymore
- 🔨 Being **really hard on yourself**

Depression isn't always obvious – it can look like just being **tired and shut down**.

## ✅ Main Differences Between Sadness and Depression

### 1️⃣ Why you feel it

- **Sadness:** Usually because of something that happened
- **Depression:** Can happen for no reason, or feel way bigger than the situation

### 2️⃣ How long it lasts

- **Sadness:** Gets better over time
- **Depression:** Lasts almost every day for **2+ weeks** (or longer)

### 3️⃣ How it affects your life

- **Sadness:** You can still do things (even if it's hard)
- **Depression:** It's really hard to do everyday things (like getting out of bed, working, or taking care of yourself)

### 4️⃣ Enjoying things

- **Sadness:** You can still enjoy some things sometimes
- **Depression:** You **stop enjoying things** you used to love (like hobbies, food, or being with people)

### 5️⃣ Energy

- **Sadness:** You're tired sometimes
- **Depression:** You're **always tired**, even after sleeping

### 6️⃣ Thoughts

- **Sadness:** "I'm hurting. I miss them."
- **Depression:** "I'm not good enough. Things will never get better. What's the point?"

### 7️⃣ How you feel about yourself

- **Sadness:** You feel bad about what happened
- **Depression:** You feel bad **about yourself**

## 🧩 Can Sadness Become Depression?

**Yes, it can.**

If sadness lasts too long, or if you also have:

- 😰 **Constant stress**
- 💔 **Gone through something traumatic**
- 🔥 **Burnout**
- 🙁 **Feeling alone**
- 🚫 **Not having people to support you**

…it can become something more serious.

That's why **talking to someone early on** (like a therapist, coach, or someone who understands) can really help.

## 🚨 When Should You Get Help?

Think about getting professional help if you feel:

- 📅 **Down most days** for 2+ weeks
- 😶 **Hopeless or empty**
- 😴 **Really tired**
- 🍽️ Like your **sleep or appetite has changed**
- 🚶 **Cut off** from people
- 😞 Like it's **hard to do things**
- 💭 Like you **don't matter**

### ⚠️ Get help right away if:

You're thinking about **hurting yourself or suicide**. You deserve help right away, and you **don't have to go through it alone**.

## ✅ In Short

**Sadness is a feeling.**

**Depression is a condition.**

Both are **real**. Both **matter**. And both **need support**.

If you're not sure how you're feeling, reaching out is a great first step – because it gets easier when you **don't carry it alone**.

👉 **Need someone to talk to? RantFree.in is here for you.**`,
    author: "RantFree Team",
    date: "2026-01-14",
    readTime: "6 min read",
    category: "Mental Health",
    tags: ["depression", "sadness", "mental health", "emotional wellness", "seeking help"],
    featured: true,
  },
  {
    id: "day-6",
    title: "📝 Day 6: 10 Signs You Need a Mental Health Break (And What to Do Next)",
    excerpt: "A lot of people wait until they're totally burned out before they chill out. But your mind usually gives you some warnings way before that happens. Spotting these signs early can really help your mental health.",
    content: `A lot of people wait until they're **totally burned out** before they chill out. But your mind usually gives you some **warnings** way before that happens. Spotting these signs early can really help your mental health.

## 🚨 10 Signs You Need to Chill

Watch out for these warning signs:

- 😴 **Always tired**, even after resting
- 😐 **Feeling blah** — nothing excites you
- 😤 **Getting annoyed** super easily
- 🧠 **Can't concentrate** on anything
- 💤 **Not feeling motivated** to do things
- 🌙 **Can't sleep** properly
- 😰 **Anxiety is up** — constant worry
- 🚶 **Avoiding people** — isolating yourself
- 🤕 **Headaches and stuff like that** — physical symptoms
- 🌊 **Feeling swamped** every single day

If you're experiencing **3 or more** of these regularly, it's time to take action!

## ✅ What to Do Right Now

### 1) Put off anything that's not a must-do

- 📋 **Prioritize ruthlessly** — what REALLY needs to happen today?
- 🚫 **Say no** to extra commitments
- 🗓️ **Reschedule** non-urgent tasks

### 2) Talk about how you feel

- 🗣️ **Open up** to someone you trust
- 📝 **Write it down** if talking feels hard
- 💬 **Don't bottle it up** — expression = relief

### 3) Quiet your mind

- 🧘 **Try deep breathing** — even 2 minutes helps
- 🚶 **Take a short walk** outside
- 📵 **Unplug** from screens for a bit

## 🌟 How RantFree.in Can Help

Writing down your feelings can be a **quick way to feel better**. 

**RantFree.in** lets you:

- 🔒 **Vent anonymously** — no judgment
- 💨 **Release stress** instantly
- 😌 **Feel less overwhelmed** without explaining yourself to anyone

Sometimes all you need is to **get it out of your head**.

## 💡 Bottom Line

Needing a break doesn't mean you're **weak**. It just means you're **human**.

Taking care of your mental health isn't selfish — it's **necessary**. Your mind deserves the same attention as your body.

👉 **Feeling stressed? Give yourself a break with RantFree.in.**`,
    author: "RantFree Team",
    date: "2026-01-13",
    readTime: "4 min read",
    category: "Mental Health",
    tags: ["mental health", "burnout", "self-care", "stress relief", "wellness tips"],
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
  {
    id: "8",
    title: "🧠 Do I Need Therapy?",
    excerpt: "You don't have to be at your lowest point to deserve some help. Therapy isn't just for people in crisis mode — it's also for people who are sick of pretending everything's okay.",
    content: `**You're not the only one.** 💙

A lot of people don't go to therapy not because they're doing great, but because they think their problems aren't **bad enough**.

They tell themselves things like:

- 😔 *"Others have it way worse."*
- 💪 *"I should be able to handle this."*
- 🤷 *"I can take care of it myself."*
- 🙄 *"It's really not a big deal."*

But here's the thing:

## 🌟 You Don't Have to Be at Your Lowest Point to Deserve Help

**Therapy isn't just for people in crisis mode.** It's also for people who are sick of pretending everything's okay.

So instead of asking:

❌ *"Am I messed up enough to go to therapy?"*

Try asking:

✅ *"Would it be nice to have someone who gets me and can help me feel better?"*

If you answered **yes** – then therapy might be a good thing for you. 🙌

---

## 💪 Therapy Doesn't Mean You're Weak

Let's be real for a sec.

Going to therapy **doesn't mean you're weak**.

It just means you've been dealing with a lot for a long time.

Sometimes you don't need therapy because something huge happened…

Sometimes you need therapy because:

🌀 **Life just keeps happening, and you never get a moment to catch your breath.**

---

## 🤔 So… Who Should Think About Therapy?

Here are some real signs – nothing dramatic, just honest stuff:

### 1) 😊 You're always trying to act okay

You smile. You work. You keep going.

**But inside, you're worn out.**

If you're constantly acting like you're fine when you're not, therapy can help you stop just getting by and **start feeling better**.

### 2) 🧠 Your brain never shuts off

You're lying in bed, but your mind won't stop:

- 🔄 Going over old conversations
- 😰 Worrying about what's to come
- 💭 Thinking too much about every little thing

You deserve some **peace** – and therapy can give you ways to quiet your mind. 🕊️

### 3) 😢 You feel down for no good reason

Maybe nothing bad is going on… but you still feel:

- 😮‍💨 Emotionally drained
- 🫥 Empty inside
- 😶 Numb
- 😤 Annoyed

Sometimes feelings don't need a reason.

**They need some love, care, and to heal.** 💗

### 4) 💔 You've been hurt and haven't dealt with it

You might think you're over it.

**But your mind and body still remember.**

This could be:

- 💔 A broken heart
- 👨‍👩‍👧 Family drama
- 🧒 Stuff from your childhood
- 🗡️ Someone betraying you
- 😢 Sadness
- 🌧️ A hard experience

**Therapy helps you leave old pain behind.** ✨

### 5) 🔁 You keep doing the same things over and over

Maybe you keep:

- ❤️‍🩹 Picking the wrong partners
- 🎭 Changing who you are for others
- 🤝 Trying to make everyone happy
- 💥 Ruining things for yourself
- 🌀 Getting stuck in a loop

Therapy is about more than just knowing what you do. It helps you figure out **why you do it**, and **how to change**. 🔑

### 6) 🏝️ You feel alone, even when you're with people

This is super common.

You can be around a bunch of people and still feel like **nobody sees you**.

Therapy gives you a place where someone **really hears you** – no judging, no guilt. 🤗

### 7) ⚠️ The ways you're coping are hurting you

Sometimes we deal with things by:

- 📱 Scrolling on our phones for hours
- 🚪 Closing ourselves off
- 🍕 Eating too much
- 🙈 Avoiding everything
- 🏃 Staying crazy busy so we don't have to feel

These aren't bad habits.

**They're just ways to get through things.**

Therapy helps you find **better ways to cope**. 💚

---

## 💡 If You're Asking Yourself, That's a Sign

Here's what a lot of people don't get:

**Folks who don't need therapy usually aren't wondering if they do.**

If therapy's been on your mind, **pay attention to that**. 👀

Your mind is asking for help the best way it knows how.

---

## 🦋 Therapy Doesn't Change You — It Helps You Get Back to Yourself

Therapy doesn't make you someone else.

It helps you get back to:

- 🧘 **The calm you**
- 💪 **The confident you**
- 🌈 **The you who's free from all the extra emotions**

---

## ✅ In Conclusion

If life's been weighing you down…

If your mind's been racing…

If your heart's been heavy…

**Therapy isn't a last resort.**

**Therapy is support** – and you **deserve** that. 💙

👉 **Ready to take the first step? Book a session with a professional on RantFree.in today.**`,
    author: "RantFree Team",
    date: "2026-01-13",
    readTime: "6 min read",
    category: "Mental Health",
    tags: ["therapy", "mental health", "self-care", "emotional wellness", "getting help"],
    featured: false,
  },
  {
    id: "9",
    title: "🌿 What to Expect in Your First Therapy Session (So You Can Relax)",
    excerpt: "Your first therapy visit isn't a test. You don't need to put on a show, explain perfectly, or act confident. It's just the start of getting the help you need.",
    content: `**Thinking about starting therapy?** 🤔 You might be having thoughts like:

- 😰 *What if I don't know what to say?*
- 😢 *What if I cry?*
- 😬 *What if it's awkward?*
- 🫣 *What if the therapist judges me?*
- 🤷 *What if therapy doesn't help?*

**Guess what? Those feelings are totally normal.** 💙

Your first therapy visit isn't a test. You don't need to put on a show, explain perfectly, or act confident. It's just the **start of getting the help you need**.

Let's go through what usually happens in that first session, so you can feel **ready, calm, and less stressed**.

---

## 🌿 Before the Session: It's Okay to Be Anxious

Most people get nervous before their first therapy session, **even if they want to go**.

**Why is that?**

Because therapy makes you do something you probably don't do much: **be really honest about how you feel**.

So, if you're nervous, it doesn't mean therapy isn't right for you. **It just means you're human.** 🤗

---

## ✅ What Happens in Your First Therapy Session (Step-by-Step)

### 1) 😊 The therapist will try to make you feel at ease

The session usually starts easy. The therapist might say something like:

- 💬 *"How are you feeling about being here today?"*
- 🤔 *"What made you want to book this session?"*
- ⏰ *"No rush."*

They get that it's your first time and expect you to be a little nervous. This first session isn't super intense. **It's usually pretty chill and supportive.**

### 2) 📋 They'll tell you how therapy works

Most therapists will quickly go over things like:

- 🔒 **Confidentiality** (privacy rules)
- 📅 How the sessions are set up
- 🧠 What their method is
- ✨ How therapy can help

They might also talk about when they might have to break confidentiality (like if someone is in danger). This is important so you feel **secure**.

### 3) 💭 You'll be asked why you're there (but don't sweat the answer)

This part can freak people out, but it's not as bad as you think. You can just be honest, like:

- 🤷 *"I don't even know where to begin."*
- 😩 *"I've been feeling super stressed lately."*
- 😰 *"I'm anxious all the time."*
- 😔 *"I just don't feel like myself."*

**That's enough.** You don't need some big, dramatic reason to start therapy. Even *"I just want some clarity and support"* is fine. ✨

### 4) 📝 They might ask you some questions about your life

The therapist might ask about:

- 💼 Work or school
- 👨‍👩‍👧 Your family
- ❤️ Relationships
- 😴 Your sleep and daily routine
- 🌡️ Changes in mood
- 😤 Things that stress you out
- 📅 Stuff that's happened in the past

They won't cover everything in one session. They're just trying to get an idea of **what your life is like and what you need**.

### 5) 😢 You might get emotional (and that's okay)

A lot of people cry in their first session. **It doesn't mean they're weak.**

It just means that, for the first time in a while, **someone is really listening without judging**.

If you cry, the therapist won't be surprised, won't stop you, and won't judge you. **Crying can be a first step to feeling better.** 💧

### 6) 🔒 You don't have to spill all your secrets right away

This is really important: **You DO NOT have to share everything in your first session.**

You can take it slow. You can say:

- 🛑 *"I'm not ready to talk about that yet."*
- 😣 *"That's hard for me to talk about."*
- ⏳ *"Can we talk about that later?"*

**A good therapist will respect that.** 🤝

### 7) 🎯 The therapist might help you set some goals

Near the end, you might talk about what you want to get out of therapy, like:

- 😌 Less anxiety
- 💪 More confidence
- 🧠 Dealing with overthinking
- 💔 Healing from the past
- 🚧 Learning how to set boundaries
- ❤️ Better relationships

The point isn't to fix everything right away. **It's to start figuring out a plan.**

### 8) 🌈 You'll leave with a little clarity (even if nothing is fixed)

A lot of people think therapy will solve everything in one session. **That's not what the first session is for.**

It's more like **opening a door**. You feel heard, your feelings make sense, you feel less alone, and you feel a little bit of hope. **That's pretty cool.** ✨

---

## ⭐ What You Can Say in Your First Session (Examples)

If you're not sure what to say, try saying one of these:

- 😰 *"I've been feeling anxious a lot lately."*
- 😮‍💨 *"I feel really emotionally drained."*
- 🔄 *"I overthink everything."*
- 😞 *"I don't feel very confident anymore."*
- 🔒 *"I feel stuck."*
- 🏝️ *"I've been feeling lonely."*
- 💚 *"I want to take care of my mental health."*

**Simple, honest, and good enough.** ✅

---

## ✅ How to Tell If the Therapist Is a Good Fit

After the first session, ask yourself:

- ✅ Did I feel like they **respected me** and that I was **safe**?
- ✅ Did they listen **without rushing me**?
- ✅ Did I feel **understood**?
- ✅ Do I feel okay with **going back**?

It's totally fine to switch therapists if you don't click with them. **Therapy works best when you feel secure.** 🤗

---

## 🌿 One Last Thing

Your first therapy session doesn't need to be perfect. You can be:

- 😬 Nervous
- 😢 Emotional
- 🤔 Confused
- 🤫 Quiet
- 🤷 Unsure

**You just need to show up.** 🙌

**Starting therapy is a brave thing to do** – not because you're broken, but because you're **choosing to take care of yourself**. 💙

👉 **Ready to take the first step? Book a session with a professional on RantFree.in today!**`,
    author: "RantFree Team",
    date: "2026-01-13",
    readTime: "8 min read",
    category: "Mental Health",
    tags: ["therapy", "first session", "mental health", "self-care", "getting started", "anxiety"],
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
