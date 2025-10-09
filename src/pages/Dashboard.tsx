import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Search, 
  Radio, 
  Heart, 
  GraduationCap, 
  Calendar,
  Video,
  Mic,
  ChevronDown,
  ChevronUp,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState("public");
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(true);
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);

  const wellnessReminders = [
    "Get sunlight every day, it boosts mood & sleep.",
    "Take your vitamins seriously.",
    "Talk & hug — human connection heals.",
    "It's okay to be bored for 15 min — creativity grows there.",
    "Eat colorful fruits and veggies daily for energy."
  ];

  // Change reminder every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReminderIndex((prev) => (prev + 1) % wellnessReminders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😠", label: "Angry" },
  ];

  const sidebarItems = [
    { icon: Home, label: "Home", active: true, path: "/dashboard" },
    { icon: Users, label: "Rantbuddity", active: false, path: "/dashboard" },
    { icon: MessageSquare, label: "Rant", active: false, path: "/dashboard" },
    { icon: Search, label: "Find Better", active: false, path: "/dashboard" },
    { icon: Radio, label: "Soul Stream", active: false, path: "/soul-stream" },
    { icon: Heart, label: "Community", active: false, path: "/dashboard" },
    { icon: GraduationCap, label: "Learn & Grow", active: false, path: "/learn-grow" },
    { icon: Calendar, label: "Book Help", active: false, path: "/book-help" },
    { icon: User, label: "Profile", active: false, path: "/profile" },
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
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Welcome Message */}
          <div>
            <h1 className="text-2xl font-medium text-[#4A4A4A] italic">
              Hi, welcome back venting_ soul!
            </h1>
          </div>

          {/* Mood Selector */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DED0]">
            <h2 className="text-lg font-semibold text-[#4A4A4A] mb-2">
              How are you feeling today?
            </h2>
            <p className="text-sm text-[#8B7355] mb-6">
              Check in with yourself. Your feelings are valid and this is not judged.
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-[#F5EFE6] transition-colors"
                >
                  <span className="text-4xl">{mood.emoji}</span>
                  <span className="text-sm text-[#6B6B6B]">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="bg-gradient-to-r from-[#FFF4E6] to-[#FFE8CC] rounded-2xl p-6 border-l-4 border-[#FF6B35]">
            <p className="text-[#D4933D] italic text-center">
              "You are a child of the universe, no less than the trees and the stars; you have a right to be here."
            </p>
          </div>

          {/* Post Rant Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DED0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#8B7355] rounded-full"></div>
              <p className="text-[#6B6B6B]">What's on your mind? Share your thoughts...</p>
            </div>

            <Textarea 
              className="min-h-[120px] mb-4 border-[#E8DED0] focus:border-[#FF6B35] bg-[#FDFBF7]"
              placeholder="Start typing..."
            />

            <div className="flex items-center justify-between">
              <RadioGroup value={postType} onValueChange={setPostType} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" className="border-[#FF6B35] text-[#FF6B35]" />
                  <Label htmlFor="public" className="text-sm text-[#6B6B6B] cursor-pointer">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anonymous" id="anonymous" className="border-[#FF6B35] text-[#FF6B35]" />
                  <Label htmlFor="anonymous" className="text-sm text-[#6B6B6B] cursor-pointer">Anonymous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" className="border-[#FF6B35] text-[#FF6B35]" />
                  <Label htmlFor="private" className="text-sm text-[#6B6B6B] cursor-pointer">Private</Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-[#E8DED0] text-[#6B6B6B] hover:bg-[#F5EFE6]">
                  <Video className="h-4 w-4 mr-2" />
                  Record Video
                </Button>
                <Button variant="outline" size="sm" className="border-[#E8DED0] text-[#6B6B6B] hover:bg-[#F5EFE6]">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                  Post
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Instant Panic Relief */}
            <div className="bg-[#E3F2FD] rounded-2xl p-6 border border-[#90CAF9]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600">⚡</span>
                <h3 className="font-semibold text-[#1976D2]">Instant Panic Relief</h3>
              </div>
              <p className="text-sm text-[#424242] mb-4">
                Use these simple grounding techniques or start a guided breathing exercise for immediate calm.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-[#1976D2] mb-2">
                  Butterfly Hug: Cross your arms and gently tap your shoulders.
                </p>
                <p className="text-xs text-blue-600">
                  5-4-3-2-1: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.
                </p>
              </div>
              <Button className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white">
                Do it now
              </Button>
            </div>

            {/* Wellness Tip */}
            <div className="bg-[#FFF9E6] rounded-2xl p-6 border border-[#FFE082] flex items-center justify-center min-h-[120px]">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-yellow-600 text-3xl">💪</span>
                <p className="text-sm text-[#6B6B6B] font-medium">
                  {wellnessReminders[currentReminderIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Helplines */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8DED0]">
            <button
              onClick={() => setShowEmergencyHelp(!showEmergencyHelp)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <h3 className="font-semibold text-[#4A4A4A]">Emergency Helplines</h3>
              </div>
              {showEmergencyHelp ? (
                <ChevronUp className="h-5 w-5 text-[#6B6B6B]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#6B6B6B]" />
              )}
            </button>

            {showEmergencyHelp && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-[#4A4A4A] mb-2">India</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-lg">
                      <div>
                        <p className="font-medium text-[#4A4A4A]">Vandrevala Foundation (India)</p>
                        <p className="text-sm text-[#6B6B6B]">Mental Health & Suicide Prevention</p>
                      </div>
                      <a href="tel:9999666555" className="text-[#FF6B35] font-semibold">
                        9999666555
                      </a>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-lg">
                      <div>
                        <p className="font-medium text-[#4A4A4A]">AASRA (India)</p>
                        <p className="text-sm text-[#6B6B6B]">Suicide Prevention & Counseling</p>
                      </div>
                      <a href="tel:9820466726" className="text-[#FF6B35] font-semibold">
                        91-9820466726
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Profile Avatar - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="w-10 h-10 bg-[#8B7355] rounded-full"></div>
      </div>
    </div>
  );
};

export default Dashboard;
