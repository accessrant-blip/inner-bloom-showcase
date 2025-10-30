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
  ChevronRight,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MoodTrackerModal from "@/components/mood/MoodTrackerModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postType, setPostType] = useState("public");
  const [postContent, setPostContent] = useState("");
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(true);
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; label: string } | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(",")[1];
          if (base64Audio) {
            await transcribeAudio(base64Audio);
          }
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "Recording...",
        description: "Speak now. Click again to stop.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const transcribeAudio = async (base64Audio: string) => {
    toast({
      title: "Processing...",
      description: "Converting speech to text...",
    });

    try {
      const { data, error } = await supabase.functions.invoke("transcribe-audio", {
        body: { audio: base64Audio },
      });

      if (error || !data?.text) {
        throw new Error("Transcription failed");
      }
      
      setPostContent((prev) => (prev ? prev + " " + data.text : data.text));
      toast({
        title: "Done!",
        description: "Voice converted to text.",
      });
    } catch (error) {
      toast({
        title: "Note",
        description: "Voice-to-text requires OpenAI API key setup.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleVideoRecord = () => {
    toast({
      title: "Coming Soon",
      description: "Video recording feature will be available soon!",
    });
  };

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

  const handlePostRant = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUserId) {
      toast({
        title: "Not authenticated",
        description: "Please log in to post.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsPosting(true);

    // Store actual privacy value
    const { error } = await supabase.from("rants").insert({
      content: postContent,
      privacy: postType,
      user_id: currentUserId,
    });

    setIsPosting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Posted!",
        description: postType === "private"
          ? "Your private post has been saved to your journal."
          : "Your post is now live in the community feed.",
      });
      setPostContent("");
    }
  };

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😠", label: "Angry" },
  ];

  const handleMoodClick = (mood: { emoji: string; label: string }) => {
    setSelectedMood(mood);
    setIsMoodModalOpen(true);
  };

  const sidebarItems = [
    { icon: Home, label: "Home", active: true, path: "/dashboard" },
    { icon: Users, label: "Connect", active: false, path: "/connect" },
    { icon: MessageSquare, label: "Kai", active: false, path: "/kai" },
    { icon: Radio, label: "Soul Stream", active: false, path: "/soul-stream" },
    { icon: Heart, label: "Connect", active: false, path: "/connect" },
    { icon: GraduationCap, label: "Learn & Grow", active: false, path: "/learn-grow" },
    { icon: Calendar, label: "Book Help", active: false, path: "/book-help" },
    { icon: User, label: "Profile", active: false, path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#E8DED0] border-r border-[#D4C4B0] p-6 transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-8 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-full p-1.5 shadow-md transition-all duration-300 z-10"
          aria-label="Toggle sidebar"
        >
          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        <div className={`flex items-center gap-2 mb-8 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          {!sidebarCollapsed && <span className="font-bold text-xl text-[#4A4A4A]">RANT</span>}
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? "bg-[#FF6B35] text-white"
                  : "text-[#6B6B6B] hover:bg-[#D4C4B0]"
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
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
                  onClick={() => handleMoodClick(mood)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-[#F5EFE6] transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-4xl">{mood.emoji}</span>
                  <span className="text-sm text-[#6B6B6B]">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Post Rant Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8DED0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#8B7355] rounded-full"></div>
              <p className="text-[#6B6B6B]">What's on your mind? Share your thoughts...</p>
            </div>

            <Textarea 
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
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
                <Button 
                  onClick={handleVideoRecord}
                  variant="outline" 
                  size="sm" 
                  className="border-[#E8DED0] text-[#6B6B6B] hover:bg-[#F5EFE6]"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Record Video
                </Button>
                <Button 
                  onClick={handleVoiceClick}
                  variant="outline" 
                  size="sm" 
                  className={`border-[#E8DED0] hover:bg-[#F5EFE6] ${
                    isRecording ? "text-red-500 animate-pulse" : "text-[#6B6B6B]"
                  }`}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handlePostRant}
                  disabled={!postContent.trim() || isPosting}
                  className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                >
                  {isPosting ? "Posting..." : "Post"}
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
              <Button 
                onClick={() => navigate("/instant-relief")}
                className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white"
              >
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

          {/* Wellness Reminder - Inspirational Quote */}
          <div className="bg-gradient-to-r from-[#FFF4E6] to-[#FFE8CC] rounded-2xl p-6 border-l-4 border-[#FF6B35]">
            <p className="text-[#D4933D] italic text-center">
              "You are a child of the universe, no less than the trees and the stars; you have a right to be here."
            </p>
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

                <div>
                  <h4 className="font-semibold text-[#4A4A4A] mb-2">International</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-lg">
                      <div>
                        <p className="font-medium text-[#4A4A4A]">Crisis Text Line</p>
                        <p className="text-sm text-[#6B6B6B]">24/7 Crisis Support (US, UK, Canada, Ireland)</p>
                      </div>
                      <span className="text-[#FF6B35] font-semibold text-sm">
                        Text HOME to 741741
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#FDFBF7] rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-[#4A4A4A]">International Suicide Hotlines</p>
                        <p className="text-sm text-[#6B6B6B]">List of hotlines by country (via Befrienders Worldwide)</p>
                      </div>
                      <a 
                        href="https://befrienders.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#FF6B35] font-semibold text-sm hover:underline whitespace-nowrap ml-2"
                      >
                        Visit Website
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
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 bg-[#8B7355] rounded-full hover:bg-[#6B5345] transition-colors cursor-pointer"
          title="Go to Profile"
        />
      </div>

      {/* Mood Tracker Modal */}
      <MoodTrackerModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        selectedMood={selectedMood}
      />
    </div>
  );
};

export default Dashboard;
