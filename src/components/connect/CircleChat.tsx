import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, MoreVertical, Users, LogOut, User } from "lucide-react";
import { generateAlias } from "@/lib/aliasGenerator";
import { checkSafetyKeywords } from "@/lib/safetyKeywords";
import { VoiceInputButton } from "@/components/accessibility/VoiceInputButton";
import { LiveRegion } from "@/components/accessibility/LiveRegion";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Circle {
  id: string;
  name: string;
  description: string;
  icon: string;
  topic?: string;
  capacity?: number;
  next_session_at?: string;
  member_count?: number;
}

interface Message {
  id: string;
  content: string;
  sender_alias: string;
  created_at: string;
  user_id: string;
  is_system_message?: boolean;
}

interface MessageWithReactions extends Message {
  reactions: { [key: string]: number };
  userReaction?: string;
}

interface Member {
  user_id: string;
  username: string;
  avatar_url: string | null;
  joined_at: string;
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
  const [members, setMembers] = useState<Member[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const membersChannelRef = useRef<any>(null);
  const previousMessagesLengthRef = useRef(0);

  useEffect(() => {
    initializeUser();
    fetchMessages();
    fetchMembers();
    setupRealtimeSubscription();
    setupMembersRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (membersChannelRef.current) {
        supabase.removeChannel(membersChannelRef.current);
      }
    };
  }, [circle.id]);

  useEffect(() => {
    scrollToBottom();
    // Announce new messages from others
    if (messages.length > previousMessagesLengthRef.current && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.user_id !== currentUserId && !lastMsg.is_system_message) {
        setLastAnnouncement(`${lastMsg.sender_alias} says: ${lastMsg.content.slice(0, 100)}`);
      }
    }
    previousMessagesLengthRef.current = messages.length;
  }, [messages, currentUserId]);

  const initializeUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      setUserAlias(generateAlias());
      await joinCircleIfNeeded(user.id);
    }
  };

  const joinCircleIfNeeded = async (userId: string) => {
    // Check if user is already a member
    const { data: existingMembership } = await supabase
      .from("user_circles")
      .select("id")
      .eq("circle_id", circle.id)
      .eq("user_id", userId)
      .single();

    if (!existingMembership) {
      // Join the circle
      const { error } = await supabase
        .from("user_circles")
        .insert({
          circle_id: circle.id,
          user_id: userId,
        });

      if (!error) {
        // Get user's profile for the system message
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", userId)
          .single();

        // Send system message
        await supabase.from("messages").insert({
          circle_id: circle.id,
          user_id: userId,
          sender_alias: "System",
          content: `${profile?.username || "A new member"} joined the group`,
          is_system_message: true,
        });

        toast({
          title: "Welcome!",
          description: `You've joined ${circle.name}`,
        });
      }
    }
  };

  const handleLeaveCircle = async () => {
    if (!currentUserId) return;

    // Get user's profile for the system message
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", currentUserId)
      .single();

    // Send system message before leaving
    await supabase.from("messages").insert({
      circle_id: circle.id,
      user_id: currentUserId,
      sender_alias: "System",
      content: `${profile?.username || "A member"} left the group`,
      is_system_message: true,
    });

    // Leave the circle
    const { error } = await supabase
      .from("user_circles")
      .delete()
      .eq("circle_id", circle.id)
      .eq("user_id", currentUserId);

    if (!error) {
      toast({
        title: "Left group",
        description: `You've left ${circle.name}`,
      });
      onBack();
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

  const setupMembersRealtimeSubscription = () => {
    membersChannelRef.current = supabase
      .channel(`circle-members-${circle.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_circles",
          filter: `circle_id=eq.${circle.id}`,
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();
  };

  const fetchMembers = async () => {
    // Fetch user_circles for this circle
    const { data: circleMembers, error: membersError } = await supabase
      .from("user_circles")
      .select("user_id, joined_at")
      .eq("circle_id", circle.id);

    if (membersError || !circleMembers) {
      console.error("Error fetching members:", membersError);
      return;
    }

    if (circleMembers.length === 0) {
      setMembers([]);
      setMemberCount(0);
      return;
    }

    // Fetch profiles for these users
    const userIds = circleMembers.map(m => m.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, username, avatar_url")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return;
    }

    // Combine the data
    const formattedMembers: Member[] = circleMembers.map((member) => {
      const profile = profiles?.find(p => p.user_id === member.user_id);
      return {
        user_id: member.user_id,
        username: profile?.username || "Unknown",
        avatar_url: profile?.avatar_url || null,
        joined_at: member.joined_at,
      };
    });

    setMembers(formattedMembers);
    setMemberCount(formattedMembers.length);
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
    }

    setIsLoading(false);
  };

  const handleReaction = async (messageId: string, reaction: string, currentReaction?: string) => {
    if (!currentUserId) return;

    if (currentReaction === reaction) {
      await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", currentUserId)
        .eq("reaction", reaction);
    } else {
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{circle.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-foreground">{circle.name}</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sheet open={showMembersPanel} onOpenChange={setShowMembersPanel}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  Members
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Members ({memberCount})</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-3">
                  {members.map((member) => (
                    <div key={member.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{member.username}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatTimestamp(member.joined_at)}
                        </p>
                      </div>
                      {member.user_id === currentUserId && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">You</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive hover:bg-destructive/10"
                    onClick={handleLeaveCircle}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Leave Group
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-auto p-4">
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.user_id === currentUserId;
            const isSystemMessage = message.is_system_message;
            
            if (isSystemMessage) {
              return (
                <div key={message.id} className="flex justify-center animate-fade-in">
                  <div className="bg-muted/50 px-4 py-2 rounded-full">
                    <p className="text-xs text-muted-foreground italic">{message.content}</p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {message.sender_alias}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground border border-border"
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
                              message.userReaction === emoji ? "bg-muted" : ""
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

      {/* Screen Reader Announcements */}
      <LiveRegion message={lastAnnouncement} priority="polite" />

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="container mx-auto max-w-4xl flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share what's on your mind…"
            className="resize-none"
            rows={2}
            aria-label="Message to group"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <VoiceInputButton
            onTranscript={(text) => setNewMessage((prev) => prev + text)}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
            size="icon"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Safety Alert Dialog */}
      <AlertDialog open={showSafetyAlert} onOpenChange={setShowSafetyAlert}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">We're here for you</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              It sounds like you might be struggling deeply. You're not alone. Here's someone who can help:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">Crisis Text Line</p>
              <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">National Suicide Prevention Lifeline</p>
              <p className="text-sm text-muted-foreground">Call 988</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-primary hover:bg-primary/90">
              I understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CircleChat;