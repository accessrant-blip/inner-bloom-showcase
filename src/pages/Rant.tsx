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
  };
}

const Rant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rantText, setRantText] = useState("");
  const [privacy, setPrivacy] = useState("anonymous");
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
      .select(`
        *,
        profiles (
          username
        )
      `)
      .eq("privacy", "public")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching rants:", error);
    } else {
      setPublicRants(data || []);
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

    const { data, error } = await supabase.functions.invoke("transcribe-audio", {
      body: { audio: base64Audio },
    });

    if (error || !data?.text) {
      toast({
        title: "Error",
        description: "Failed to transcribe audio.",
        variant: "destructive",
      });
    } else {
      setRantText((prev) => prev + " " + data.text);
      toast({
        title: "Done!",
        description: "Voice converted to text.",
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

    const privacyValue = privacy === "anonymous" ? "public" : privacy;

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
        description: privacyValue === "public" ? "Your rant is now live in the community." : "Your private rant has been saved to your journal.",
      });
      setRantText("");
      if (privacyValue === "public") {
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
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C4B0] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#6B6B6B] hover:text-[#FF6B35] transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-[#4A4A4A]">Share Your Thoughts</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Post Section */}
        <Card className="p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold text-[#4A4A4A] mb-2">What's on your mind?</h2>
          <p className="text-[#FF6B35] text-sm mb-4">This is a safe space. Let it all out.</p>

          <div className="relative">
            <Textarea
              value={rantText}
              onChange={(e) => setRantText(e.target.value)}
              placeholder="Share your feelings, frustrations, or anything else..."
              className="min-h-[120px] resize-none border-[#D4C4B0] focus:border-[#FF6B35]"
            />
            <button
              onClick={handleVoiceClick}
              className={`absolute bottom-3 right-3 transition-colors ${
                isRecording ? "text-red-500 animate-pulse" : "text-[#6B6B6B] hover:text-[#FF6B35]"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-[#4A4A4A] mb-2 block">
                Visibility:
              </Label>
              <RadioGroup value={privacy} onValueChange={setPrivacy} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anonymous" id="anonymous" />
                  <Label htmlFor="anonymous" className="cursor-pointer text-sm">
                    Anonymous
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="cursor-pointer text-sm">
                    Private
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="cursor-pointer text-sm">
                    Public
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handlePostRant}
              disabled={!rantText.trim() || isLoading}
              className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-8"
            >
              {isLoading ? "Posting..." : "Post Rant"}
            </Button>
          </div>
        </Card>

        {/* Community Rants Feed */}
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Community Rants</h2>
          <div className="space-y-4">
            {publicRants.length === 0 ? (
              <Card className="p-6 bg-white text-center">
                <p className="text-[#6B6B6B]">No public rants yet. Be the first to share!</p>
              </Card>
            ) : (
              publicRants.map((rant) => (
                <Card key={rant.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm text-[#FF6B35] font-medium">
                      Posted by {privacy === "anonymous" || !rant.profiles?.username ? "Anonymous" : rant.profiles.username}
                    </p>
                    <span className="text-xs text-[#6B6B6B]">{formatTimestamp(rant.created_at)}</span>
                  </div>
                  
                  <p className="text-[#4A4A4A] mb-4 whitespace-pre-wrap">{rant.content}</p>

                  <div className="flex items-center gap-4 pt-3 border-t border-[#E8DED0]">
                    <button className="flex items-center gap-1 text-sm text-[#FF6B35] hover:underline">
                      <MessageCircle className="h-4 w-4" />
                      <span>12 comments</span>
                    </button>

                    {currentUserId === rant.user_id && (
                      <button
                        onClick={() => handleDeleteRant(rant.id)}
                        className="flex items-center gap-1 text-sm text-[#FF6B35] hover:text-[#FF5722] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}

                    <button className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#4A4A4A] transition-colors ml-auto">
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
