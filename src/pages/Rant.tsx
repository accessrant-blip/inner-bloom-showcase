import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
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
  const [selectedRantId, setSelectedRantId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [newComment, setNewComment] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    getCurrentUser();
    fetchPublicRants();
    fetchCommentCounts();
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

  const fetchCommentCounts = async () => {
    const { data } = await supabase
      .from("rant_comments")
      .select("rant_id");
    
    if (data) {
      const counts = data.reduce((acc, comment) => {
        acc[comment.rant_id] = (acc[comment.rant_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      setCommentCounts(counts);
    }
  };

  const fetchComments = async (rantId: string) => {
    const { data, error } = await supabase
      .from("rant_comments")
      .select("*")
      .eq("rant_id", rantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    // Fetch usernames for comments
    const commentsWithProfiles = await Promise.all(
      (data || []).map(async (comment) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", comment.user_id)
          .single();
        
        return { ...comment, profiles: profile };
      })
    );
    
    setComments(commentsWithProfiles);
  };

  const handleOpenComments = async (rantId: string) => {
    setSelectedRantId(rantId);
    setIsCommentsOpen(true);
    await fetchComments(rantId);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUserId || !selectedRantId) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("rant_comments").insert({
      rant_id: selectedRantId,
      user_id: currentUserId,
      content: newComment,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Posted",
        description: "Your comment has been added",
      });
      setNewComment("");
      await fetchComments(selectedRantId);
      await fetchCommentCounts();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from("rant_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Comment removed",
      });
      if (selectedRantId) {
        await fetchComments(selectedRantId);
        await fetchCommentCounts();
      }
    }
  };

  const handleOpenReport = (rantId: string) => {
    setSelectedRantId(rantId);
    setIsReportOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!currentUserId || !selectedRantId) {
      toast({
        title: "Error",
        description: "You must be logged in to report",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("rant_reports").insert({
      rant_id: selectedRantId,
      reporter_user_id: currentUserId,
      reason: reportReason,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reported",
        description: "Thank you for helping keep our community safe",
      });
      setIsReportOpen(false);
      setReportReason("");
      setSelectedRantId(null);
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
                    <button 
                      onClick={() => handleOpenComments(rant.id)}
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover hover:underline transition-colors duration-300"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{commentCounts[rant.id] || 0} comments</span>
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

                    <button 
                      onClick={() => handleOpenReport(rant.id)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ml-auto"
                    >
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Comments Dialog */}
        <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddComment} size="sm">
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3 pt-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            {comment.profiles?.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(comment.created_at)}
                          </p>
                        </div>
                        {currentUserId === comment.user_id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="h-8 text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Report Dialog */}
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Report Rant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Help us understand why you're reporting this post.
              </p>
              <Textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting (optional)..."
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReportOpen(false);
                    setReportReason("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReport}
                  variant="destructive"
                  className="flex-1"
                >
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Rant;
