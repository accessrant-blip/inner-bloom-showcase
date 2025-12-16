import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Heart, Wind, BookOpen, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { checkSafetyKeywords } from "@/lib/safetyKeywords";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Kai = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there 💛 I'm Kai, and I'm here to listen. How are you feeling right now?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kai-chat`;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const detectMood = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Anger patterns
    if (lowerText.match(/angry|mad|furious|irritated|annoyed|pissed|rage|frustrated|hate|ugh/)) return "angry";
    
    // Sadness patterns
    if (lowerText.match(/sad|depressed|down|crying|tears|hopeless|helpless|worthless|tired of|give up|can't go on/)) return "sad";
    
    // Anxiety/Stress patterns
    if (lowerText.match(/anxious|worried|nervous|scared|afraid|panic|stress|overwhelm|can't relax|freaking out|心配/)) return "anxious";
    
    // Loneliness patterns
    if (lowerText.match(/lonely|alone|isolated|no one|nobody|ignored|left out|abandoned/)) return "lonely";
    
    // Stress/Overload patterns
    if (lowerText.match(/stressed|overwhelmed|too much|can't cope|burned out|exhausted|pressure/)) return "stressed";
    
    // Numbness patterns
    if (lowerText.match(/numb|empty|nothing|void|disconnected|detached|feel nothing/)) return "numb";
    
    // Happiness/Positive patterns
    if (lowerText.match(/happy|excited|great|good|wonderful|amazing|grateful|peaceful|better|relaxed|joyful|content/)) return "happy";
    
    return "";
  };

  const streamChat = async (userMessage: string) => {
    const mood = detectMood(userMessage);
    setDetectedMood(mood);

    // SECURITY: Get user session for authenticated API call
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to chat with Kai.",
        variant: "destructive",
      });
      return;
    }

    const conversationHistory = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        messages: [...conversationHistory, { role: "user", content: userMessage }],
        userMood: mood,
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        toast({
          title: "Too many messages",
          description: "Please wait a moment before sending another message.",
          variant: "destructive",
        });
      } else if (resp.status === 402) {
        toast({
          title: "Service unavailable",
          description: "Kai is temporarily unavailable. Please try again later.",
          variant: "destructive",
        });
      } else {
        throw new Error(errorData.error || "Failed to get response");
      }
      return;
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantMessage = "";

    // Add assistant message placeholder
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", timestamp: new Date() },
    ]);

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantMessage += content;
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: assistantMessage,
                timestamp: new Date(),
              };
              return newMessages;
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Check for safety keywords
    if (checkSafetyKeywords(inputText)) {
      setShowSafetyDialog(true);
    }

    const userMessage = inputText.trim();
    setInputText("");
    
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    setIsLoading(true);
    try {
      await streamChat(userMessage);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      // Remove the placeholder assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveEmotionSuggestion = async (emotion: string, suggestion: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('emotion_suggestions').insert({
        user_id: user.id,
        emotion,
        suggestion
      });
    } catch (error) {
      console.error('Error saving emotion suggestion:', error);
    }
  };

  const getSuggestionCard = () => {
    const suggestions: Record<string, { text: string; action: string; icon: JSX.Element; path: string }> = {
      angry: {
        text: "Talk to a Compassionate Listener 💛",
        action: "Professional support can help process anger",
        icon: <Users className="h-5 w-5" />,
        path: "/book-help"
      },
      sad: {
        text: "Write it out in your Journal ✍️",
        action: "Express your feelings through writing",
        icon: <BookOpen className="h-5 w-5" />,
        path: "/wellness-toolkit/journal"
      },
      anxious: {
        text: "Try Instant Panic Relief 🫁",
        action: "Breathing exercises help reduce anxiety",
        icon: <Wind className="h-5 w-5" />,
        path: "/instant-relief"
      },
      lonely: {
        text: "Join the Soul Stream 🌐",
        action: "Connect with others in a safe space",
        icon: <Users className="h-5 w-5" />,
        path: "/soul-stream"
      },
      stressed: {
        text: "Try Instant Panic Relief 🫁",
        action: "Breathing exercises can help calm stress",
        icon: <Wind className="h-5 w-5" />,
        path: "/instant-relief"
      },
      numb: {
        text: "Talk to a Compassionate Listener 💛",
        action: "Professional support can help",
        icon: <Users className="h-5 w-5" />,
        path: "/book-help"
      },
      happy: {
        text: "Share this positive moment 🌸",
        action: "Post to Soul Stream and spread joy",
        icon: <Heart className="h-5 w-5" />,
        path: "/soul-stream"
      }
    };

    const suggestion = suggestions[detectedMood];
    if (!suggestion) return null;

    const handleClick = () => {
      saveEmotionSuggestion(detectedMood, suggestion.text);
      navigate(suggestion.path);
    };

    return (
      <button
        onClick={handleClick}
        className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow w-full text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {suggestion.icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{suggestion.text}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{suggestion.action}</p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background/50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Chat with Kai 💬</h1>
          <p className="text-muted-foreground">Your compassionate AI companion</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 px-2">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground"
                  } shadow-soft animate-fade-in border-border rounded-2xl`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.content && (
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </Card>
              </div>
            ))}
            
            {/* Mood-based suggestions */}
            {detectedMood && !isLoading && (
              <div className="flex justify-center animate-fade-in max-w-md mx-auto px-4">
                <div className="w-full space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Need extra support?</p>
                  {getSuggestionCard()}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-soft">
          <div className="flex gap-3">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="min-h-[60px] max-h-[120px] resize-none border-border rounded-xl bg-background"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              variant="wellness"
              className="px-6 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Kai is here to listen and support. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </div>

      {/* Safety Dialog */}
      <AlertDialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-primary">
              <AlertCircle className="h-5 w-5" />
              You're Not Alone
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-foreground">
              <p>
                It sounds like you might be going through something really difficult right now. 
                You're not alone, and there are people who can help.
              </p>
              <div className="bg-accent p-4 rounded-lg space-y-2">
                <p className="font-semibold text-foreground">24/7 Crisis Support:</p>
                <p className="text-sm">
                  <strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988
                </p>
                <p className="text-sm">
                  <strong>Crisis Text Line:</strong> Text HOME to 741741
                </p>
                <Button
                  onClick={() => navigate("/emergency-support")}
                  variant="wellness"
                  className="w-full mt-2 rounded-xl"
                >
                  View All Emergency Resources
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSafetyDialog(false)}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Kai;
