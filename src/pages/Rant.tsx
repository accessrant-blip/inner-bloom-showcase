import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Flag, MessageCircle, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Rant {
  id: string;
  content: string;
  privacy: string;
  user_id: string;
  created_at: string;
  mood?: string;
  profiles?: {
    username: string;
  } | null;
}

const Rant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rantText, setRantText] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [publicRants, setPublicRants] = useState<Rant[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    getCurrentUser();
    fetchPublicRants();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchPublicRants = async () => {
    const { data, error } = await supabase
      .from("rants")
      .select("*")
      .in("privacy", ["public", "anonymous"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching rants:", error);
      setPublicRants([]);
    } else {
      // Fetch usernames separately for public posts
      const rantsWithProfiles = await Promise.all(
        (data || []).map(async (rant) => {
          if (rant.user_id && rant.privacy === "public") {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username")
              .eq("user_id", rant.user_id)
              .single();
            
            return { ...rant, profiles: profile };
          }
          return { ...rant, profiles: null };
        })
      );
      setPublicRants(rantsWithProfiles);
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
      
      setRantText((prev) => (prev ? prev + " " + data.text : data.text));
      toast({
        title: "Done!",
        description: "Voice converted to text.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transcribe audio. Voice-to-text is not set up yet.",
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

  const handlePostRant = async () => {
    if (!rantText.trim()) {
      toast({
        title: "Empty rant",
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
      return;
    }

    setIsLoading(true);

    // Convert "public" to "anonymous" for anonymity
    const privacyValue = privacy === "public" ? "anonymous" : "private";
    
    const { error } = await supabase.from("rants").insert({
      content: rantText,
      privacy: privacyValue,
      user_id: currentUserId,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post rant. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Posted!",
        description: privacy === "private" ? "Your private rant has been saved to your journal." : "Your rant is now live in the community.",
      });
      setRantText("");
      if (privacy !== "private") {
        fetchPublicRants();
      }
    }
  };

  const handleDeleteRant = async (rantId: string) => {
    const { error } = await supabase.from("rants").delete().eq("id", rantId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete rant.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Your rant has been removed.",
      });
      fetchPublicRants();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen gradient-soft page-transition">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 shadow-soft">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Share Your Thoughts</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Post Section */}
        <Card className="p-6 bg-card shadow-soft border-border animate-fade-in">
          <h2 className="text-xl font-semibold text-foreground mb-2">What's on your mind?</h2>
          <p className="text-primary text-sm mb-4">This is a safe space. Let it all out.</p>

          <div className="relative">
            <Textarea
              value={rantText}
              onChange={(e) => setRantText(e.target.value)}
              placeholder="Share your feelings, frustrations, or anything else..."
              className="min-h-[120px] resize-none border-border focus:border-primary rounded-xl bg-input"
            />
            <button
              onClick={handleVoiceClick}
              className={`absolute bottom-3 right-3 transition-all duration-300 ${
                isRecording ? "text-destructive animate-pulse" : "text-muted-foreground hover:text-primary"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Share as:
              </Label>
              <RadioGroup value={privacy} onValueChange={setPrivacy} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" className="border-primary text-primary" />
                  <Label htmlFor="public" className="cursor-pointer text-sm text-foreground">
                    Public (Anonymous)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" className="border-primary text-primary" />
                  <Label htmlFor="private" className="cursor-pointer text-sm text-foreground">
                    Private (Journal Only)
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2">
                {privacy === "public" 
                  ? "Your post will appear in the community feed anonymously" 
                  : "Only you can see this in your journal"}
              </p>
            </div>

            <Button
              onClick={handlePostRant}
              disabled={!rantText.trim() || isLoading}
              variant="wellness"
              className="px-8 rounded-xl"
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </Card>

        {/* Community Rants Feed */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Community Rants</h2>
          <div className="space-y-4">
            {publicRants.length === 0 ? (
              <Card className="p-6 bg-card text-center shadow-soft animate-fade-in">
                <p className="text-muted-foreground">No public rants yet. Be the first to share!</p>
              </Card>
            ) : (
              publicRants.map((rant) => (
                <Card key={rant.id} className="p-6 bg-card shadow-soft hover:shadow-glow transition-all duration-300 border-border animate-fade-in">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm text-primary font-medium">
                      Anonymous
                    </p>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(rant.created_at)}</span>
                  </div>
                  
                  <p className="text-foreground mb-4 whitespace-pre-wrap">{rant.content}</p>

                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <button className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover hover:underline transition-colors duration-300">
                      <MessageCircle className="h-4 w-4" />
                      <span>12 comments</span>
                    </button>

                    {currentUserId === rant.user_id && (
                      <button
                        onClick={() => handleDeleteRant(rant.id)}
                        className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}

                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ml-auto">
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rant;
