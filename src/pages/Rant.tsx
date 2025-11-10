import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Flag, MessageCircle } from "lucide-react";
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
  const [privacy, setPrivacy] = useState("anonymous");
  const [publicRants, setPublicRants] = useState<Rant[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      // Fetch usernames for public posts
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
    
    const { error } = await supabase.from("rants").insert({
      content: rantText,
      privacy: privacy,
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
        description: privacy === "private" 
          ? "Your private rant has been saved to your journal." 
          : privacy === "public"
          ? "Your rant is now live in the community with your username."
          : "Your anonymous rant is now live in the community.",
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

          <Textarea
            value={rantText}
            onChange={(e) => setRantText(e.target.value)}
            placeholder="Share your feelings, frustrations, or anything else..."
            className="min-h-[120px] resize-none border-border focus:border-primary rounded-xl bg-input"
          />

          <div className="mt-4 flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Share as:
              </Label>
              <RadioGroup value={privacy} onValueChange={setPrivacy} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" className="border-primary text-primary" />
                  <Label htmlFor="public" className="cursor-pointer text-sm text-foreground">
                    Public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anonymous" id="anonymous" className="border-primary text-primary" />
                  <Label htmlFor="anonymous" className="cursor-pointer text-sm text-foreground">
                    Anonymous
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
                  ? "Your post will appear with your username in the community feed"
                  : privacy === "anonymous" 
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
                      {rant.privacy === "public" && rant.profiles?.username 
                        ? rant.profiles.username 
                        : "Anonymous"}
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
