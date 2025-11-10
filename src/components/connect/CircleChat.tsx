import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, MoreVertical, Heart, ThumbsUp, Smile } from "lucide-react";
import { generateAlias } from "@/lib/aliasGenerator";
import { checkSafetyKeywords } from "@/lib/safetyKeywords";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Circle {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Message {
  id: string;
  content: string;
  sender_alias: string;
  created_at: string;
  user_id: string;
}

interface MessageWithReactions extends Message {
  reactions: { [key: string]: number };
  userReaction?: string;
}

interface CircleChatProps {
  circle: Circle;
  onBack: () => void;
}

const CircleChat = ({ circle, onBack }: CircleChatProps) => {
  const [messages, setMessages] = useState<MessageWithReactions[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userAlias, setUserAlias] = useState<string>("");
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    initializeUser();
    fetchMessages();
    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [circle.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      setUserAlias(generateAlias());
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setupRealtimeSubscription = () => {
    channelRef.current = supabase
      .channel(`circle-${circle.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `circle_id=eq.${circle.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, { ...newMsg, reactions: {} }]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();
  };

  const fetchMessages = async () => {
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("circle_id", circle.id)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return;
    }

    const { data: reactionsData } = await supabase
      .from("message_reactions")
      .select("message_id, reaction, user_id")
      .in("message_id", messagesData.map((m) => m.id));

    const messagesWithReactions = messagesData.map((msg) => {
      const msgReactions = reactionsData?.filter((r) => r.message_id === msg.id) || [];
      const reactionCounts: { [key: string]: number } = {};
      let userReaction: string | undefined;

      msgReactions.forEach((r) => {
        reactionCounts[r.reaction] = (reactionCounts[r.reaction] || 0) + 1;
        if (r.user_id === currentUserId) {
          userReaction = r.reaction;
        }
      });

      return { ...msg, reactions: reactionCounts, userReaction };
    });

    setMessages(messagesWithReactions);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    // Check for safety keywords
    if (checkSafetyKeywords(newMessage)) {
      setShowSafetyAlert(true);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("messages").insert({
      circle_id: circle.id,
      user_id: currentUserId,
      sender_alias: userAlias,
      content: newMessage.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been shared with the circle.",
      });
    }

    setIsLoading(false);
  };

  const handleReaction = async (messageId: string, reaction: string, currentReaction?: string) => {
    if (!currentUserId) return;

    // If user already reacted with the same emoji, remove it
    if (currentReaction === reaction) {
      await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", currentUserId)
        .eq("reaction", reaction);
    } else {
      // Remove old reaction if exists, then add new one
      if (currentReaction) {
        await supabase
          .from("message_reactions")
          .delete()
          .eq("message_id", messageId)
          .eq("user_id", currentUserId);
      }

      await supabase.from("message_reactions").insert({
        message_id: messageId,
        user_id: currentUserId,
        reaction,
      });
    }

    fetchMessages();
  };

  const handleReport = async (messageId: string) => {
    if (!currentUserId) return;

    const { error } = await supabase.from("message_reports").insert({
      message_id: messageId,
      reporter_user_id: currentUserId,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to report message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reported",
        description: "Thank you for helping keep this space safe.",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8DCC4] p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{circle.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-[#4A4A4A]">{circle.name}</h1>
              <p className="text-sm text-[#6B6B6B]">{circle.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-auto p-4">
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.user_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[#6B6B6B]">
                      {message.sender_alias}
                    </span>
                    <span className="text-xs text-[#6B6B6B]">
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? "bg-[#FF6B35] text-white"
                        : "bg-white text-[#4A4A4A] border border-[#E8DCC4]"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  
                  {/* Reactions */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      {["👍", "👏", "💭"].map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className={`h-8 px-2 text-sm ${
                            message.userReaction === emoji ? "bg-[#FDFBF7]" : ""
                          }`}
                          onClick={() => handleReaction(message.id, emoji, message.userReaction)}
                        >
                          {emoji}
                          {message.reactions[emoji] && (
                            <span className="ml-1 text-xs">{message.reactions[emoji]}</span>
                          )}
                        </Button>
                      ))}
                    </div>

                    {!isOwnMessage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleReport(message.id)}>
                            Report Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#E8DCC4] p-4">
        <div className="container mx-auto max-w-4xl flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share what's on your mind…"
            className="resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90"
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Safety Alert Dialog */}
      <AlertDialog open={showSafetyAlert} onOpenChange={setShowSafetyAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#4A4A4A]">We're here for you</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B6B6B]">
              It sounds like you might be struggling deeply. You're not alone. Here's someone who can help:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4">
            <div className="p-4 bg-[#FDFBF7] rounded-lg">
              <p className="font-semibold text-[#4A4A4A]">Crisis Text Line</p>
              <p className="text-sm text-[#6B6B6B]">Text HOME to 741741</p>
            </div>
            <div className="p-4 bg-[#FDFBF7] rounded-lg">
              <p className="font-semibold text-[#4A4A4A]">National Suicide Prevention Lifeline</p>
              <p className="text-sm text-[#6B6B6B]">Call 988</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-[#FF6B35] hover:bg-[#FF6B35]/90">
              I understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CircleChat;
