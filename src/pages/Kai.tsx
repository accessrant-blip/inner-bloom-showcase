import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2, Heart, Wind, BookOpen, Users, AlertCircle, Save, Trash2, Sparkles, MessageCircle, Volume2, VolumeX, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { checkSafetyKeywords } from "@/lib/safetyKeywords";
import { VoiceInputButton } from "@/components/accessibility/VoiceInputButton";
import { TextToSpeechButton } from "@/components/accessibility/TextToSpeechButton";
import { LiveRegion } from "@/components/accessibility/LiveRegion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTION_CHIPS = [
  "I feel anxious",
  "I feel overwhelmed",
  "I don't know what I'm feeling",
  "I just need to vent",
];

const Kai = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string>("");
  const [lastAnnouncement, setLastAnnouncement] = useState("");
  const [saveChatsEnabled, setSaveChatsEnabled] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(() => {
    try {
      return localStorage.getItem("kai-auto-read") === "true";
    } catch {
      return false;
    }
  });
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastReadMessageIndex, setLastReadMessageIndex] = useState(-1);
  const [userProfile, setUserProfile] = useState<{ username: string; avatar_url: string | null } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kai-chat`;

  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

  const hasUserMessages = messages.some((m) => m.role === "user");

  // Persist auto-read preference
  useEffect(() => {
    try {
      localStorage.setItem("kai-auto-read", String(autoReadEnabled));
    } catch {}
  }, [autoReadEnabled]);

  // Load user preferences and saved chats
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("user_id", user.id)
        .single();

      if (profileData) setUserProfile(profileData);

      const { data: prefData } = await supabase
        .from("user_preferences")
        .select("save_ai_chats")
        .eq("user_id", user.id)
        .single();

      if (prefData) setSaveChatsEnabled(prefData.save_ai_chats);
      setHasLoadedPreference(true);

      if (prefData?.save_ai_chats) {
        const { data: chatData } = await supabase
          .from("ai_chat")
          .select("messages")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (chatData?.messages && Array.isArray(chatData.messages) && chatData.messages.length > 0) {
          const loadedMessages = (chatData.messages as { role: string; content: string; timestamp: string }[]).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(loadedMessages);
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-read new assistant messages
  useEffect(() => {
    if (!autoReadEnabled) return;
    const lastMessage = messages[messages.length - 1];
    const lastIndex = messages.length - 1;
    if (lastMessage?.role === "assistant" && lastMessage.content && lastIndex > lastReadMessageIndex && !isLoading) {
      speak(lastMessage.content);
      setLastReadMessageIndex(lastIndex);
    }
  }, [messages, autoReadEnabled, isLoading, lastReadMessageIndex, speak]);

  // Save chat when messages change
  useEffect(() => {
    if (!hasLoadedPreference || !userId || !saveChatsEnabled) return;
    if (messages.length <= 1) return;

    const saveChat = async () => {
      const messagesToSave = messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      }));

      const { data: existingChat } = await supabase
        .from("ai_chat")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (existingChat) {
        await supabase.from("ai_chat").update({ messages: messagesToSave }).eq("id", existingChat.id);
      } else {
        await supabase.from("ai_chat").insert({ user_id: userId, messages: messagesToSave });
      }
    };

    const debounce = setTimeout(saveChat, 1000);
    return () => clearTimeout(debounce);
  }, [messages, saveChatsEnabled, hasLoadedPreference, userId]);

  const handleSavePreferenceChange = async (enabled: boolean) => {
    setSaveChatsEnabled(enabled);
    if (!userId) return;

    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      await supabase.from("user_preferences").update({ save_ai_chats: enabled }).eq("user_id", userId);
    } else {
      await supabase.from("user_preferences").insert({ user_id: userId, save_ai_chats: enabled });
    }

    if (!enabled) {
      await supabase.from("ai_chat").delete().eq("user_id", userId);
      toast({ title: "Chat history deleted", description: "Your chat history has been removed." });
    } else {
      toast({ title: "Chat saving enabled", description: "Your conversations will now be saved." });
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setDetectedMood("");
    setShowClearDialog(false);
  };

  const detectMood = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/angry|mad|furious|irritated|annoyed|pissed|rage|frustrated|hate|ugh/)) return "angry";
    if (lowerText.match(/sad|depressed|down|crying|tears|hopeless|helpless|worthless|tired of|give up|can't go on/)) return "sad";
    if (lowerText.match(/anxious|worried|nervous|scared|afraid|panic|stress|overwhelm|can't relax|freaking out/)) return "anxious";
    if (lowerText.match(/lonely|alone|isolated|no one|nobody|ignored|left out|abandoned/)) return "lonely";
    if (lowerText.match(/stressed|overwhelmed|too much|can't cope|burned out|exhausted|pressure/)) return "stressed";
    if (lowerText.match(/numb|empty|nothing|void|disconnected|detached|feel nothing/)) return "numb";
    if (lowerText.match(/happy|excited|great|good|wonderful|amazing|grateful|peaceful|better|relaxed|joyful|content/)) return "happy";
    return "";
  };

  const streamChat = async (userMessage: string) => {
    const mood = detectMood(userMessage);
    setDetectedMood(mood);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Authentication required", description: "Please sign in to chat with Kai.", variant: "destructive" });
      return;
    }

    const conversationHistory = messages.map(({ role, content }) => ({ role, content }));

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ messages: [...conversationHistory, { role: "user", content: userMessage }], userMood: mood }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        toast({ title: "Too many messages", description: "Please wait a moment before sending another message.", variant: "destructive" });
      } else if (resp.status === 402) {
        toast({ title: "Service unavailable", description: "Kai is temporarily unavailable. Please try again later.", variant: "destructive" });
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

    setMessages((prev) => [...prev, { role: "assistant", content: "", timestamp: new Date() }]);

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
        if (jsonStr === "[DONE]") { streamDone = true; break; }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantMessage += content;
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: "assistant", content: assistantMessage, timestamp: new Date() };
              return newMessages;
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (assistantMessage) {
      setLastAnnouncement(`Kai says: ${assistantMessage.slice(0, 200)}${assistantMessage.length > 200 ? "..." : ""}`);
    }
  };

  const handleSendMessage = async (overrideText?: string) => {
    const text = overrideText ?? inputText;
    if (!text.trim() || isLoading) return;

    if (checkSafetyKeywords(text)) setShowSafetyDialog(true);

    const userMessage = text.trim();
    setInputText("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);

    setIsLoading(true);
    try {
      await streamChat(userMessage);
    } catch (error) {
      console.error("Chat error:", error);
      toast({ title: "Error", description: "Failed to get response. Please try again.", variant: "destructive" });
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
      await supabase.from("emotion_suggestions").insert({ user_id: user.id, emotion, suggestion });
    } catch (error) {
      console.error("Error saving emotion suggestion:", error);
    }
  };

  const getSuggestionCard = () => {
    const suggestions: Record<string, { text: string; action: string; icon: JSX.Element; path: string }> = {
      angry: { text: "Talk to a Compassionate Listener", action: "Professional support can help process anger", icon: <Users className="h-5 w-5" />, path: "/book-help" },
      sad: { text: "Write it out in your Journal", action: "Express your feelings through writing", icon: <BookOpen className="h-5 w-5" />, path: "/wellness-toolkit/journal" },
      anxious: { text: "Try Instant Panic Relief", action: "Breathing exercises help reduce anxiety", icon: <Wind className="h-5 w-5" />, path: "/instant-relief" },
      lonely: { text: "Join the Soul Stream", action: "Connect with others in a safe space", icon: <Users className="h-5 w-5" />, path: "/soul-stream" },
      stressed: { text: "Try Instant Panic Relief", action: "Breathing exercises can help calm stress", icon: <Wind className="h-5 w-5" />, path: "/instant-relief" },
      numb: { text: "Talk to a Compassionate Listener", action: "Professional support can help", icon: <Users className="h-5 w-5" />, path: "/book-help" },
      happy: { text: "Share this positive moment", action: "Post to Soul Stream and spread joy", icon: <Heart className="h-5 w-5" />, path: "/soul-stream" },
    };

    const suggestion = suggestions[detectedMood];
    if (!suggestion) return null;

    return (
      <button
        onClick={() => {
          saveEmotionSuggestion(detectedMood, suggestion.text);
          navigate(suggestion.path);
        }}
        className="group relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-4 text-left backdrop-blur-xl transition-all duration-500 hover:border-primary/40 hover:shadow-lg"
      >
        <div className="relative flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {suggestion.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground tracking-tight">{suggestion.text}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{suggestion.action}</p>
          </div>
          <Send className="h-4 w-4 shrink-0 text-primary/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </button>
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-4 pt-4 md:px-6">
        {/* Compact Header */}
        <header className="mb-4 animate-fade-in">
          <div className="flex items-center justify-between">
            {/* Left: Avatar + Status */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                {/* Animated pulse dot */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-foreground">Kai</h1>
                <p className="text-xs text-primary font-medium">Listening</p>
              </div>
            </div>

            {/* Right: Icon Buttons */}
            <TooltipProvider delayDuration={300}>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowClearDialog(true)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Clear chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Clear Chat</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setAutoReadEnabled((prev) => {
                          const next = !prev;
                          if (!next) stopSpeaking();
                          return next;
                        });
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        autoReadEnabled
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      aria-label={autoReadEnabled ? "Voice on" : "Voice off"}
                    >
                      {autoReadEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>{autoReadEnabled ? "Voice On" : "Voice Off"}</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleSavePreferenceChange(!saveChatsEnabled)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        saveChatsEnabled
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      aria-label={saveChatsEnabled ? "Save chat enabled" : "Save chat disabled"}
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>{saveChatsEnabled ? "Saving On" : "Saving Off"}</p></TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </header>

        {/* Screen Reader Announcements */}
        <LiveRegion message={lastAnnouncement} priority="polite" />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pb-4" role="log" aria-label="Chat messages" aria-live="polite">
          <div className="space-y-4">
            {/* Welcome Card — shown when no user messages */}
            {!hasUserMessages && !isLoading && (
              <div className="flex flex-col items-center pt-8 pb-4 animate-fade-in">
                {/* Kai glow avatar */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-xl shadow-primary/25">
                    <Sparkles className="h-9 w-9" />
                  </div>
                </div>

                <div className="text-center max-w-sm mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-2">Hey, I'm Kai.</h2>
                  <p className="text-muted-foreground text-[15px] leading-relaxed">
                    You don't have to have the right words.<br />
                    Start wherever you are.
                  </p>
                </div>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      disabled={isLoading}
                      className="rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-foreground/80 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2.5 animate-fade-in ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <Avatar className={`h-8 w-8 shrink-0 shadow-sm ${message.role === "assistant" ? "ring-1 ring-primary/20" : ""}`}>
                  {message.role === "user" && userProfile?.avatar_url && (
                    <AvatarImage src={userProfile.avatar_url} alt={userProfile.username || "User"} />
                  )}
                  <AvatarFallback
                    className={`text-xs font-semibold ${
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.role === "assistant" ? "K" : (userProfile?.username?.[0]?.toUpperCase() || "Y")}
                  </AvatarFallback>
                </Avatar>

                {/* Bubble */}
                <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
                  <p className={`mb-0.5 text-[11px] font-medium tracking-wide ${
                    message.role === "user" ? "text-right text-muted-foreground" : "text-left text-primary/80"
                  }`}>
                    {message.role === "assistant" ? "Kai" : (userProfile?.username || "You")}
                  </p>

                  <div
                    className={`group relative overflow-hidden rounded-2xl px-4 py-3 transition-all duration-300 ${
                      message.role === "user"
                        ? "rounded-br-md bg-primary/10 text-foreground"
                        : "rounded-bl-md border border-border/40 bg-card/70 text-foreground backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="whitespace-pre-wrap text-[15px] leading-relaxed flex-1">{message.content}</p>
                      {message.role === "assistant" && message.content && (
                        <TextToSpeechButton
                          text={message.content}
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary/10"
                        />
                      )}
                    </div>

                    {message.content && (
                      <p className={`mt-1.5 text-[10px] tracking-wide ${
                        message.role === "user" ? "text-muted-foreground/60" : "text-muted-foreground/60"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex items-end gap-2.5 animate-fade-in">
                <Avatar className="h-8 w-8 shrink-0 shadow-sm ring-1 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                    K
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-md border border-border/40 bg-card/70 px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Kai is thinking</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/50" style={{ animationDelay: "0ms" }} />
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/50" style={{ animationDelay: "200ms" }} />
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/50" style={{ animationDelay: "400ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mood Suggestion */}
            {detectedMood && !isLoading && (
              <div className="mx-auto max-w-md animate-fade-in pt-4">
                <div className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Need extra support?</span>
                </div>
                {getSuggestionCard()}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Bar */}
        <div className="sticky bottom-0 pt-3">
          <div className="relative overflow-hidden rounded-full border border-border/50 bg-card/80 pl-5 pr-2 py-2 backdrop-blur-xl shadow-[0_-4px_24px_-8px_hsl(var(--primary)/0.06)]">
            <div className="flex items-center gap-2">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="What's feeling heavy right now?"
                className="flex-1 resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none max-h-[100px] min-h-[24px] py-1 leading-normal"
                disabled={isLoading}
                rows={1}
                aria-label="Message to Kai"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />

              <VoiceInputButton
                onTranscript={(text) => setInputText((prev) => prev + text)}
                disabled={isLoading}
                size="sm"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:scale-105 disabled:opacity-40 disabled:shadow-none disabled:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Chat Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg text-foreground">Clear this conversation?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Safety Dialog */}
      <AlertDialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <AlertDialogContent className="rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AlertCircle className="h-5 w-5" />
              </div>
              You're Not Alone
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-foreground/80">
              <p>
                It sounds like you might be going through something really difficult right now.
                You're not alone, and there are people who can help.
              </p>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <p className="font-semibold text-foreground">24/7 Crisis Support:</p>
                <div className="space-y-2 text-sm">
                  <p><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                  <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                </div>
                <Button onClick={() => navigate("/emergency-support")} className="w-full mt-2 rounded-xl bg-primary hover:bg-primary/90">
                  View All Emergency Resources
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSafetyDialog(false)} className="rounded-xl bg-muted text-foreground hover:bg-muted/80">
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Kai;
