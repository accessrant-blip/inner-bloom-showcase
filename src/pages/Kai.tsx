import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Heart, Wind, BookOpen, Users, AlertCircle, Save, Trash2, Sparkles, MessageCircle, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { checkSafetyKeywords } from "@/lib/safetyKeywords";
import { VoiceInputButton } from "@/components/accessibility/VoiceInputButton";
import { TextToSpeechButton } from "@/components/accessibility/TextToSpeechButton";
import { LiveRegion } from "@/components/accessibility/LiveRegion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      content: "Hey there, I'm Kai, and I'm here to listen. How are you feeling right now?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string>("");
  const [lastAnnouncement, setLastAnnouncement] = useState("");
  const [saveChatsEnabled, setSaveChatsEnabled] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastReadMessageIndex, setLastReadMessageIndex] = useState(-1);
  const [userProfile, setUserProfile] = useState<{ username: string; avatar_url: string | null } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kai-chat`;

  // TTS hook for auto-read
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

  // Load user preferences and saved chats
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);

      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setUserProfile(profileData);
      }

      // Load preference
      const { data: prefData } = await supabase
        .from('user_preferences')
        .select('save_ai_chats')
        .eq('user_id', user.id)
        .single();

      if (prefData) {
        setSaveChatsEnabled(prefData.save_ai_chats);
      }
      setHasLoadedPreference(true);

      // Only load saved chats if consent is given
      if (prefData?.save_ai_chats) {
        const { data: chatData } = await supabase
          .from('ai_chat')
          .select('messages')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (chatData?.messages && Array.isArray(chatData.messages) && chatData.messages.length > 0) {
          const loadedMessages = (chatData.messages as { role: string; content: string; timestamp: string }[]).map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.timestamp)
          }));
          setMessages(loadedMessages);
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-read new assistant messages
  useEffect(() => {
    if (!autoReadEnabled) return;
    
    const lastMessage = messages[messages.length - 1];
    const lastIndex = messages.length - 1;
    
    // Only read if it's a new assistant message with content
    if (
      lastMessage?.role === "assistant" && 
      lastMessage.content && 
      lastIndex > lastReadMessageIndex &&
      !isLoading
    ) {
      speak(lastMessage.content);
      setLastReadMessageIndex(lastIndex);
    }
  }, [messages, autoReadEnabled, isLoading, lastReadMessageIndex, speak]);

  // Save chat when messages change (only if consent given)
  useEffect(() => {
    if (!hasLoadedPreference || !userId || !saveChatsEnabled) return;
    if (messages.length <= 1) return;

    const saveChat = async () => {
      const messagesToSave = messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString()
      }));

      const { data: existingChat } = await supabase
        .from('ai_chat')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (existingChat) {
        await supabase
          .from('ai_chat')
          .update({ messages: messagesToSave })
          .eq('id', existingChat.id);
      } else {
        await supabase
          .from('ai_chat')
          .insert({ user_id: userId, messages: messagesToSave });
      }
    };

    const debounce = setTimeout(saveChat, 1000);
    return () => clearTimeout(debounce);
  }, [messages, saveChatsEnabled, hasLoadedPreference, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSavePreferenceChange = async (enabled: boolean) => {
    setSaveChatsEnabled(enabled);
    
    if (!userId) return;

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      await supabase
        .from('user_preferences')
        .update({ save_ai_chats: enabled })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_preferences')
        .insert({ user_id: userId, save_ai_chats: enabled });
    }

    if (!enabled) {
      await supabase
        .from('ai_chat')
        .delete()
        .eq('user_id', userId);

      toast({
        title: "Chat history deleted",
        description: "Your chat history has been removed and will no longer be saved.",
      });
    } else {
      toast({
        title: "Chat saving enabled",
        description: "Your conversations will now be saved for future sessions.",
      });
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hey there, I'm Kai, and I'm here to listen. How are you feeling right now?",
        timestamp: new Date(),
      },
    ]);
    setDetectedMood("");
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

    if (assistantMessage) {
      setLastAnnouncement(`Kai says: ${assistantMessage.slice(0, 200)}${assistantMessage.length > 200 ? '...' : ''}`);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

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
        text: "Talk to a Compassionate Listener",
        action: "Professional support can help process anger",
        icon: <Users className="h-5 w-5" />,
        path: "/book-help"
      },
      sad: {
        text: "Write it out in your Journal",
        action: "Express your feelings through writing",
        icon: <BookOpen className="h-5 w-5" />,
        path: "/wellness-toolkit/journal"
      },
      anxious: {
        text: "Try Instant Panic Relief",
        action: "Breathing exercises help reduce anxiety",
        icon: <Wind className="h-5 w-5" />,
        path: "/instant-relief"
      },
      lonely: {
        text: "Join the Soul Stream",
        action: "Connect with others in a safe space",
        icon: <Users className="h-5 w-5" />,
        path: "/soul-stream"
      },
      stressed: {
        text: "Try Instant Panic Relief",
        action: "Breathing exercises can help calm stress",
        icon: <Wind className="h-5 w-5" />,
        path: "/instant-relief"
      },
      numb: {
        text: "Talk to a Compassionate Listener",
        action: "Professional support can help",
        icon: <Users className="h-5 w-5" />,
        path: "/book-help"
      },
      happy: {
        text: "Share this positive moment",
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
        className="group relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 text-left backdrop-blur-xl transition-all duration-500 hover:border-primary/40 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.3)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-inner transition-transform duration-300 group-hover:scale-110">
            {suggestion.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground tracking-tight">{suggestion.text}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{suggestion.action}</p>
          </div>
          <div className="shrink-0 text-primary/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
            <Send className="h-4 w-4" />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Premium Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/8 via-primary/4 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-primary/6 via-transparent to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-primary/3 to-transparent blur-2xl" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col p-4 md:p-6">
          {/* Premium Header */}
          <header className="mb-6 animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.1)]">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card bg-emerald-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Chat with Kai</h1>
                    <p className="text-sm text-muted-foreground">Your compassionate AI companion</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearChat}
                    className="gap-2 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                  
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-4 py-2 backdrop-blur-sm">
                    <Switch
                      id="auto-read"
                      checked={autoReadEnabled}
                      onCheckedChange={(enabled) => {
                        setAutoReadEnabled(enabled);
                        if (!enabled) stopSpeaking();
                      }}
                      aria-describedby="auto-read-description"
                      className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="auto-read" className="cursor-pointer">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="hidden sm:inline">Auto-Read</span>
                      </div>
                      <span id="auto-read-description" className="text-xs text-muted-foreground">
                        {autoReadEnabled ? "On" : "Off"}
                      </span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-4 py-2 backdrop-blur-sm">
                    <Switch
                      id="save-chats"
                      checked={saveChatsEnabled}
                      onCheckedChange={handleSavePreferenceChange}
                      aria-describedby="save-chats-description"
                      className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="save-chats" className="cursor-pointer">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Save className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="hidden sm:inline">Save Chats</span>
                      </div>
                      <span id="save-chats-description" className="text-xs text-muted-foreground">
                        {saveChatsEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Screen Reader Announcements */}
          <LiveRegion message={lastAnnouncement} priority="polite" />

          {/* Messages Container */}
          <div 
            className="flex-1 overflow-y-auto px-1 pb-4"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-3 animate-fade-in ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className={`h-9 w-9 shrink-0 shadow-md ${message.role === "assistant" ? "ring-2 ring-primary/20" : "ring-2 ring-muted"}`}>
                    {message.role === "user" && userProfile?.avatar_url && (
                      <AvatarImage src={userProfile.avatar_url} alt={userProfile.username || "User"} />
                    )}
                    <AvatarFallback className={`text-sm font-semibold ${
                      message.role === "assistant" 
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {message.role === "assistant" ? "K" : (userProfile?.username?.[0]?.toUpperCase() || "Y")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Content */}
                  <div className="flex flex-col max-w-[75%]">
                    {/* Sender Name */}
                    <p className={`mb-1 text-xs font-medium tracking-wide ${
                      message.role === "user" ? "text-right text-muted-foreground" : "text-left text-primary"
                    }`}>
                      {message.role === "assistant" ? "Kai" : (userProfile?.username || "You")}
                    </p>
                    
                    {/* Message Bubble */}
                    <div
                      className={`group relative overflow-hidden rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 ${
                        message.role === "user"
                          ? "rounded-br-md bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-primary/20"
                          : "rounded-bl-md border border-border/50 bg-card/80 text-foreground backdrop-blur-sm"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                      
                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
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
                          <p className={`mt-2 text-[11px] tracking-wide ${
                            message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                          }`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-end gap-3 animate-fade-in">
                  <Avatar className="h-9 w-9 shrink-0 shadow-md ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                      K
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-bl-md border border-border/50 bg-card/80 px-5 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mood-based suggestions */}
              {detectedMood && !isLoading && (
                <div className="mx-auto max-w-md animate-fade-in pt-4">
                  <div className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>Need extra support?</span>
                  </div>
                  {getSuggestionCard()}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Premium Input Area */}
          <div className="sticky bottom-0 pt-4">
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/70 p-4 backdrop-blur-xl shadow-[0_-8px_32px_-8px_hsl(var(--primary)/0.08)]">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/3 via-transparent to-transparent" />
              
              <div className="relative flex gap-3">
                <div className="relative flex-1">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    className="min-h-[56px] max-h-[140px] resize-none rounded-2xl border-border/50 bg-background/60 pr-12 text-[15px] placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={isLoading}
                    aria-label="Message to Kai"
                  />
                  <div className="absolute bottom-2 right-2">
                    <VoiceInputButton
                      onTranscript={(text) => setInputText((prev) => prev + text)}
                      disabled={isLoading}
                      size="sm"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105 disabled:opacity-50 disabled:shadow-none disabled:scale-100"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <p className="mt-3 text-center text-xs text-muted-foreground/70">
                Press Enter to send · Shift+Enter for new line · Click mic for voice input
              </p>
            </div>
          </div>
        </div>
      </div>

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
                <Button
                  onClick={() => navigate("/emergency-support")}
                  className="w-full mt-2 rounded-xl bg-primary hover:bg-primary/90"
                >
                  View All Emergency Resources
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSafetyDialog(false)}
              className="rounded-xl bg-muted text-foreground hover:bg-muted/80"
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