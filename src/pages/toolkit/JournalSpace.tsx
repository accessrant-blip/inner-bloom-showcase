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

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
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
    await supabase.from("rants").delete().eq("id", id);
    toast.success("Entry deleted");
    fetchEntries();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-warm-cream/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/wellness-toolkit")}
          className="mb-6 text-warm-brown hover:bg-warm-cream"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Button>

        <Card className="rounded-3xl shadow-soft border-warm-brown/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-warm-brown">
                Journal 📖
              </CardTitle>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              Your private space for thoughts and reflections
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No entries yet. Start journaling to capture your thoughts 💭</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-6 rounded-2xl border border-warm-brown/20 bg-white hover:border-warm-orange/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-warm-brown">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString()}
                        {entry.mood && ` • ${entry.mood}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(entry)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.content}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit" : "New"} Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl"
              />
              <Input
                placeholder="How are you feeling? (optional)"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="rounded-xl"
              />
              <Textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="rounded-xl min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleVoiceRecord}
                  className="rounded-xl flex-1"
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Journal
                    </>
                  )}
                </Button>
                <Button onClick={handleSave} className="rounded-xl flex-1">
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