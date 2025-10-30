import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Home,
  Users,
  MessageSquare,
  Search,
  Radio,
  Heart,
  GraduationCap,
  Calendar,
} from "lucide-react";

const LearnAndGrow = () => {
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: Home, label: "Home", active: false, path: "/dashboard" },
    { icon: Users, label: "Connect", active: false, path: "/connect" },
    { icon: MessageSquare, label: "Kai", active: false, path: "/kai" },
    { icon: Search, label: "Find Better", active: false, path: "/dashboard" },
    { icon: Radio, label: "Soul Stream", active: false, path: "/soul-stream" },
    { icon: Heart, label: "Connect", active: false, path: "/connect" },
    { icon: GraduationCap, label: "Learn & Grow", active: true, path: "/learn-grow" },
    { icon: Calendar, label: "Book Help", active: false, path: "/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#E8DED0] border-r border-[#D4C4B0] p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-xl text-[#4A4A4A]">RANT</span>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? "bg-[#FF6B35] text-white"
                  : "text-[#6B6B6B] hover:bg-[#D4C4B0]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#4A4A4A] mb-3">Learn & Grow</h1>
            <p className="text-[#8B7355]">
              Explore topics to help you understand and manage your mental well-being.
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {/* Self-Harm */}
            <AccordionItem value="self-harm" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Self-Harm</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Understanding why self-harm happens and learning effective strategies to prevent it and find healthier coping mechanisms.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Practical strategies to help:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Use ice cubes or snap a rubber band on your wrist for physical sensation without harm</li>
                  <li>Call a trusted friend or crisis helpline when urges arise</li>
                  <li>Practice the 15-minute rule: wait 15 minutes and the urge often passes</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Coping with Depression */}
            <AccordionItem value="depression" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Coping with Depression</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Strategies for managing symptoms of depression, including severe depression, to improve daily functioning and overall well-being.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Daily coping actions:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Set one small achievable goal each morning (even if it's just getting out of bed)</li>
                  <li>Spend 10 minutes in sunlight daily to help regulate mood</li>
                  <li>Break tasks into tiny steps and celebrate each completion</li>
                  <li>Create a playlist of songs that lift your spirits</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Panic Attack Instant Relief */}
            <AccordionItem value="panic-relief" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Panic Attack Instant Relief</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Quick and effective techniques like the butterfly hug and grounding to manage panic attacks in the moment.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Instant calming methods:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Butterfly Hug:</strong> Cross arms over chest and gently tap shoulders alternately</li>
                  <li><strong>5-4-3-2-1 Grounding:</strong> Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste</li>
                  <li><strong>Box Breathing:</strong> Breathe in for 4, hold for 4, out for 4, hold for 4</li>
                  <li><strong>Cold water:</strong> Splash cold water on your face or hold ice cubes</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Exercise and Mental Health */}
            <AccordionItem value="exercise" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Exercise and Mental Health</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Exploring the powerful connection between physical activity and improved mental health, including mood enhancement and stress reduction.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Simple movement tips:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Take a 10-minute walk around your neighborhood or home</li>
                  <li>Dance to your favorite songs for 5 minutes</li>
                  <li>Try gentle stretching or yoga for 15 minutes</li>
                  <li>Do jumping jacks or march in place during TV commercials</li>
                  <li>Use stairs instead of elevators when possible</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Benefits of Therapy */}
            <AccordionItem value="therapy" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Benefits of Therapy</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Understanding how therapy provides a safe space to explore feelings, develop coping skills, and work towards mental wellness.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-4">
                  Therapy offers a confidential, non-judgmental space where you can express yourself freely. 
                  A trained therapist can help you identify patterns, develop healthy coping strategies, and work through 
                  challenges at your own pace.
                </p>
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                  Book Therapist
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Diet and Mental Wellness */}
            <AccordionItem value="diet" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Diet and Mental Wellness</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    How a balanced diet rich in essential nutrients can support brain health and positively influence your mood and mental state.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Actionable diet suggestions:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Start your day with protein (eggs, yogurt, or nuts) to stabilize blood sugar</li>
                  <li>Include omega-3 rich foods like salmon, walnuts, or flaxseeds</li>
                  <li>Eat dark leafy greens daily for folate and magnesium</li>
                  <li>Stay hydrated - dehydration affects mood and cognition</li>
                  <li>Limit caffeine and sugar which can cause mood swings</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Mindfulness & Meditation */}
            <AccordionItem value="mindfulness" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Mindfulness & Meditation</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Learning to focus on the present moment through mindfulness and meditation to reduce stress and increase self-awareness.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-4">
                  Mindfulness is about being fully present in the moment without judgment. Even 5 minutes daily can 
                  significantly reduce stress and improve emotional regulation.
                </p>
                <Button 
                  className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  onClick={() => navigate('/wellness-toolkit/breathe')}
                >
                  Breathe With Me
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Sleep & Mental Health */}
            <AccordionItem value="sleep" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Sleep & Mental Health</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    The critical role of quality sleep in emotional regulation, cognitive function, and overall mental resilience.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Sleep hygiene tips:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Keep a consistent sleep schedule, even on weekends</li>
                  <li>Create a cool, dark, quiet sleeping environment</li>
                  <li>Avoid screens 1 hour before bed (blue light disrupts sleep)</li>
                  <li>Try relaxation techniques like progressive muscle relaxation</li>
                  <li>Limit caffeine after 2 PM and avoid heavy meals before bed</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Building Resilience */}
            <AccordionItem value="resilience" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Building Resilience</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Developing the ability to bounce back from adversity, trauma, and stress through specific skills and mindsets.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Remember these affirmations:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>"I have survived 100% of my worst days so far"</li>
                  <li>"This feeling is temporary, and I am capable of moving through it"</li>
                  <li>"Every challenge I face helps me grow stronger"</li>
                  <li>Practice gratitude - write down 3 things you're grateful for daily</li>
                  <li>Build a support network - resilience grows through connection</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* The Power of Human Connection */}
            <AccordionItem value="connection" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">The Power of Human Connection</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Talking to AI or journaling can help in the moment, but humans are wired for deep connection. Engaging with friends, family, or loved ones rewires the brain for resilience and emotional wellbeing.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-4">
                  Human connection triggers the release of oxytocin and other neurochemicals that reduce stress, 
                  build trust, and promote healing. Even a brief conversation can shift your nervous system from 
                  fight-or-flight to rest-and-digest mode.
                </p>
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                  Book Compassionate Listener
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Stress Management Techniques */}
            <AccordionItem value="stress" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Stress Management Techniques</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Practical ways to manage and reduce chronic stress to protect your mental and physical health.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Effective stress management methods:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Deep breathing:</strong> Practice 4-7-8 breathing (inhale 4, hold 7, exhale 8)</li>
                  <li><strong>Time blocking:</strong> Schedule specific times for work, rest, and activities</li>
                  <li><strong>Progressive muscle relaxation:</strong> Tense and release each muscle group</li>
                  <li><strong>Nature time:</strong> Spend at least 20 minutes outside daily</li>
                  <li><strong>Say no:</strong> Set boundaries and protect your energy</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Understanding Anxiety */}
            <AccordionItem value="anxiety" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Understanding Anxiety</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Differentiating between normal worry and an anxiety disorder, and learning about common symptoms and treatments.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">
                  Anxiety becomes a disorder when worry is excessive, persistent, and interferes with daily life. 
                  Common symptoms include racing thoughts, rapid heartbeat, and avoidance behaviors.
                </p>
                <p className="mb-3 font-medium">Grounding exercises for anxiety:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Place your feet flat on the floor and focus on the sensation of ground beneath you</li>
                  <li>Hold an ice cube and focus on the cold sensation</li>
                  <li>Name objects around you in alphabetical order</li>
                  <li>Count backwards from 100 by 7s</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Self-Compassion & Positive Self-Talk */}
            <AccordionItem value="self-compassion" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Self-Compassion & Positive Self-Talk</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    The practice of treating yourself with the same kindness you would offer a friend, and reframing negative inner dialogues.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">Practice these reframes:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Instead of:</strong> "I'm such a failure" → <strong>Try:</strong> "I'm learning and growing through challenges"</li>
                  <li><strong>Instead of:</strong> "I can't do anything right" → <strong>Try:</strong> "I'm doing the best I can with what I have right now"</li>
                  <li>Speak to yourself like you would speak to a dear friend</li>
                  <li>Acknowledge your effort, not just outcomes</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Substance Use and Mental Health */}
            <AccordionItem value="substance" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Substance Use and Mental Health</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Understanding the complex relationship between substance use and mental health, and the importance of integrated treatment.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <p className="mb-3">
                  Substance use and mental health conditions often occur together. Self-medicating with alcohol or drugs 
                  can temporarily mask symptoms but ultimately worsens mental health.
                </p>
                <p className="mb-2 font-medium">If you need help:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Seek integrated treatment that addresses both mental health and substance use</li>
                  <li>Contact SAMHSA National Helpline: 1-800-662-4357 (confidential, 24/7)</li>
                  <li>Talk to your doctor about safe treatment options</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Building Healthy Habits */}
            <AccordionItem value="habits" className="bg-[#FFF9F0] border-[#E8DED0] rounded-xl px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Building Healthy Habits</h3>
                  <p className="text-sm text-[#8B7355] mt-1">
                    Simple, consistent actions that can improve your mental well-being over time.
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6B6B6B] pt-2 pb-4">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Morning habits:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Make your bed (gives a sense of accomplishment)</li>
                      <li>Drink a glass of water before coffee</li>
                      <li>Take 3 deep breaths before checking your phone</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Evening habits:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Write down 3 good things that happened today</li>
                      <li>Prepare for tomorrow to reduce morning stress</li>
                      <li>Do a quick body scan meditation before sleep</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      {/* Profile Avatar - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="w-10 h-10 bg-[#8B7355] rounded-full"></div>
      </div>
    </div>
  );
};

export default LearnAndGrow;
