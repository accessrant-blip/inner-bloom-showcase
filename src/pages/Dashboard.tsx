import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video,
  Mic,
  ChevronDown,
  ChevronUp
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; label: string } | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [username, setUsername] = useState<string>("friend");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
    
    if (user) {
      // Fetch username and avatar from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.username) {
        setUsername(profile.username);
      }
      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
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

  return (
    <div className="min-h-screen bg-background/50 p-8">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto space-y-6">
          {/* Welcome Message */}
          <div className="animate-fade-up">
            <h1 className="text-3xl font-medium text-foreground">
              Hi, welcome back {username}!
            </h1>
          </div>

          {/* Mood Selector */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              How are you feeling today?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Check in with yourself. Your feelings are valid and this is not judged.
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleMoodClick(mood)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-accent transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="text-4xl">{mood.emoji}</span>
                  <span className="text-sm text-muted-foreground">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Post Rant Section */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-foreground">
                  {username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground">What's on your mind? Share your thoughts...</p>
            </div>

            <Textarea 
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[120px] mb-4 border-border focus:border-primary bg-input rounded-xl"
              placeholder="Start typing..."
            />

            <div className="flex items-center justify-between">
              <RadioGroup value={postType} onValueChange={setPostType} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" className="border-primary text-primary" />
                  <Label htmlFor="public" className="text-sm text-foreground cursor-pointer">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anonymous" id="anonymous" className="border-primary text-primary" />
                  <Label htmlFor="anonymous" className="text-sm text-foreground cursor-pointer">Anonymous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" className="border-primary text-primary" />
                  <Label htmlFor="private" className="text-sm text-foreground cursor-pointer">Private</Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleVideoRecord}
                  variant="outline" 
                  size="sm" 
                  className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-xl transition-all duration-300"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Record Video
                </Button>
                <Button 
                  onClick={handleVoiceClick}
                  variant="outline" 
                  size="sm" 
                  className={`border-border hover:bg-accent rounded-xl transition-all duration-300 ${
                    isRecording ? "text-destructive animate-pulse" : "text-muted-foreground"
                  }`}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handlePostRant}
                  disabled={!postContent.trim() || isPosting}
                  variant="wellness"
                  className="rounded-xl"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Instant Panic Relief */}
            <div className="bg-success-soft rounded-2xl p-6 border border-success/30 shadow-soft animate-fade-in hover:shadow-glow transition-all">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-success">Instant Panic Relief</h3>
              </div>
              <p className="text-sm text-foreground/80 mb-4">
                Use these simple grounding techniques or start a guided breathing exercise for immediate calm.
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-success mb-2">
                  Butterfly Hug: Cross your arms and gently tap your shoulders.
                </p>
                <p className="text-xs text-success/80">
                  5-4-3-2-1: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/instant-relief")}
                className="w-full bg-success hover:bg-success/90 text-success-foreground rounded-xl transition-all duration-300 shadow-glow"
              >
                Do it now
              </Button>
            </div>

            {/* Wellness Tip */}
            <div className="bg-primary-soft rounded-2xl p-6 border border-primary/30 flex items-center justify-center min-h-[120px] shadow-soft animate-fade-in hover:shadow-glow transition-all">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-foreground font-medium">
                  {wellnessReminders[currentReminderIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* Wellness Reminder - Inspirational Quote */}
          <div className="bg-accent-soft rounded-2xl p-6 border-l-4 border-primary shadow-soft animate-fade-in hover:shadow-glow transition-all">
            <p className="text-primary italic text-center text-lg">
              "You are a child of the universe, no less than the trees and the stars; you have a right to be here."
            </p>
          </div>

          {/* Emergency Helplines */}
          <div className="bg-destructive/5 rounded-2xl p-6 shadow-soft border border-destructive/20 animate-fade-in hover:shadow-glow transition-all">
            <button
              onClick={() => setShowEmergencyHelp(!showEmergencyHelp)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-semibold text-foreground">Emergency Helplines</h3>
              </div>
              {showEmergencyHelp ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {showEmergencyHelp && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">India</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-accent rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">Vandrevala Foundation (India)</p>
                        <p className="text-sm text-muted-foreground">Mental Health & Suicide Prevention</p>
                      </div>
                      <a href="tel:9999666555" className="text-primary font-semibold hover:text-primary-hover transition-colors">
                        9999666555
                      </a>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">AASRA (India)</p>
                        <p className="text-sm text-muted-foreground">Suicide Prevention & Counseling</p>
                      </div>
                      <a href="tel:9820466726" className="text-primary font-semibold hover:text-primary-hover transition-colors">
                        91-9820466726
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">International</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-accent rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">Crisis Text Line</p>
                        <p className="text-sm text-muted-foreground">24/7 Crisis Support (US, UK, Canada, Ireland)</p>
                      </div>
                      <span className="text-primary font-semibold text-sm">
                        Text HOME to 741741
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent rounded-xl">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">International Suicide Hotlines</p>
                        <p className="text-sm text-muted-foreground">List of hotlines by country (via Befrienders Worldwide)</p>
                      </div>
                      <a 
                        href="https://befrienders.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-semibold text-sm hover:text-primary-hover hover:underline whitespace-nowrap ml-2 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar - Top Right */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 bg-primary/20 rounded-full hover:bg-primary/30 transition-all duration-300 cursor-pointer shadow-soft"
              title="Go to Profile"
            />
          </div>
        </div>

      <MoodTrackerModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        selectedMood={selectedMood}
      />
    </div>
  );
};

export default Dashboard;
