import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useJournalPrompts } from "@/hooks/useJournalPrompts";
import WritingPrompts from "@/components/journal/WritingPrompts";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
}

interface DeletingEntry {
  id: string;
  isDeleting: boolean;
}

export default function JournalSpace() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [deletingEntries, setDeletingEntries] = useState<DeletingEntry[]>([]);
  const { prompts, dismissed, refresh, dismiss, selectPrompt } = useJournalPrompts(mood);
  const showPrompts = !dismissed && !content.trim() && !editingEntry;
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("rants")
      .select("*")
      .eq("user_id", user.id)
      .eq("privacy", "private")
      .order("created_at", { ascending: false });

    if (data) {
      setEntries(data);
    }
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }

    if (editingEntry) {
      await supabase
        .from("rants")
        .update({ title: title || "Untitled", content, mood })
        .eq("id", editingEntry.id);
      toast.success("Entry updated");
    } else {
      await supabase
        .from("rants")
        .insert({
          user_id: user.id,
          title: title || "Untitled",
          content,
          mood,
          privacy: "private"
        });
      toast.success("Entry saved");
    }

    setIsDialogOpen(false);
    setTitle("");
    setContent("");
    setMood("");
    setEditingEntry(null);
    fetchEntries();
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title || "");
    setContent(entry.content);
    setMood(entry.mood || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Start the animation
    setDeletingEntries(prev => [...prev, { id, isDeleting: true }]);
    
    // Wait for animation to complete before actually deleting
    setTimeout(async () => {
      await supabase.from("rants").delete().eq("id", id);
      toast.success("Released to the universe");
      setDeletingEntries(prev => prev.filter(entry => entry.id !== id));
      fetchEntries();
    }, 600); // Match animation duration
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info("Voice recording feature coming soon!");
      setTimeout(() => setIsRecording(false), 2000);
    } else {
      setIsRecording(false);
    }
  };

  const isEntryDeleting = (id: string) => {
    return deletingEntries.some(entry => entry.id === id && entry.isDeleting);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/wellness-toolkit")}
          className="mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-3">
            Journal Space
          </h1>
          <p className="text-muted-foreground text-lg">
            A peaceful place for your thoughts and reflections
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setIsDialogOpen(true)}
            size="lg"
            className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </Button>
        </div>

        <div className="space-y-6">
          {entries.length === 0 ? (
            <Card className="border-none shadow-soft bg-card/50 backdrop-blur-sm animate-fade-in">
              <CardContent className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
                  <Plus className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground text-lg mb-2">Your journal is empty</p>
                <p className="text-muted-foreground/70 text-sm">
                  Start writing to capture your thoughts and feelings
                </p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card
                key={entry.id}
                className={`border-none shadow-soft bg-card/80 backdrop-blur-sm hover:shadow-glow transition-all duration-300 overflow-hidden ${
                  isEntryDeleting(entry.id) ? 'animate-toss-to-bin' : 'animate-fade-in'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-light text-foreground mb-2">
                        {entry.title || "Untitled"}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {entry.mood && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="px-3 py-1 rounded-full bg-muted/50 text-xs">
                              {entry.mood}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(entry)}
                        className="h-9 w-9 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        disabled={isEntryDeleting(entry.id)}
                        className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light">
                {editingEntry ? "Edit Entry" : "New Entry"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              <div>
                <Input
                  placeholder="Give your entry a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-lg border-muted text-lg"
                />
              </div>
              <div>
                <Input
                  placeholder="How are you feeling?"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="rounded-lg border-muted"
                />
              </div>
              <div>
                {showPrompts && (
                  <div className="mb-3">
                    <WritingPrompts
                      prompts={prompts}
                      onSelectPrompt={(prompt) => {
                        selectPrompt(prompt);
                        setContent(prompt + " ");
                      }}
                      onRefresh={refresh}
                      onDismiss={dismiss}
                    />
                  </div>
                )}
                <Textarea
                  placeholder="Let your thoughts flow..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="rounded-lg min-h-[240px] border-muted resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleVoiceRecord}
                  className="rounded-lg flex-1"
                  disabled={isRecording}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Voice (Coming Soon)
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="rounded-lg flex-1"
                >
                  Save Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}