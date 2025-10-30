import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2, Heart, Wind, BookOpen, Users, AlertCircle } from "lucide-react";
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
    if (lowerText.match(/angry|mad|furious|irritated|annoyed/)) return "angry";
    if (lowerText.match(/sad|depressed|down|crying|tears/)) return "sad";
    if (lowerText.match(/anxious|worried|nervous|scared|afraid/)) return "anxious";
    if (lowerText.match(/happy|excited|great|good|wonderful|amazing/)) return "happy";
    if (lowerText.match(/lonely|alone|isolated/)) return "lonely";
    if (lowerText.match(/numb|empty|nothing/)) return "numb";
    return "";
  };

  const streamChat = async (userMessage: string) => {
    const mood = detectMood(userMessage);
    setDetectedMood(mood);

    const conversationHistory = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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

  const getSuggestionButton = () => {
    switch (detectedMood) {
      case "angry":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/wellness-toolkit/breathe")}
            className="gap-2"
          >
            <Wind className="h-4 w-4" />
            Try Breathing Tool
          </Button>
        );
      case "sad":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/wellness-toolkit/journal")}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Journal This
          </Button>
        );
      case "anxious":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/wellness-toolkit/ground")}
            className="gap-2"
          >
            <Heart className="h-4 w-4" />
            Ground Yourself
          </Button>
        );
      case "lonely":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/connect")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Join Circle
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EFE6] to-[#E8DED0] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#D4C4B0] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#6B6B6B] hover:text-[#FF6B35] transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#4A4A4A]">Chat with Kai</h1>
            <p className="text-sm text-[#6B6B6B]">Your compassionate AI companion</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-[#FF6B35] text-white"
                    : "bg-white text-[#4A4A4A]"
                } shadow-sm animate-fade-in`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.content && (
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-white/70" : "text-[#6B6B6B]"
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
            <div className="flex justify-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
                <p className="text-sm text-[#6B6B6B]">Need extra support?</p>
                {getSuggestionButton()}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#D4C4B0] px-6 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-[#FF6B35] hover:bg-[#FF5722] text-white px-6"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-[#6B6B6B] text-center mt-2">
          Kai is here to listen and support. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>

      {/* Safety Dialog */}
      <AlertDialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-[#FF6B35]">
              <AlertCircle className="h-5 w-5" />
              You're Not Alone
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-[#4A4A4A]">
              <p>
                It sounds like you might be going through something really difficult right now. 
                You're not alone, and there are people who can help.
              </p>
              <div className="bg-[#F5EFE6] p-4 rounded-lg space-y-2">
                <p className="font-semibold text-[#4A4A4A]">24/7 Crisis Support:</p>
                <p className="text-sm">
                  <strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988
                </p>
                <p className="text-sm">
                  <strong>Crisis Text Line:</strong> Text HOME to 741741
                </p>
                <Button
                  onClick={() => navigate("/emergency-support")}
                  className="w-full mt-2 bg-[#FF6B35] hover:bg-[#FF5722]"
                >
                  View All Emergency Resources
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSafetyDialog(false)}
              className="bg-[#4A4A4A] hover:bg-[#6B6B6B]"
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
