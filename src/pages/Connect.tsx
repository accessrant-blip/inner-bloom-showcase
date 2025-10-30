import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Home, Users, MessageSquare, Radio, Heart, GraduationCap, Calendar, User } from "lucide-react";
import CircleChat from "@/components/connect/CircleChat";

interface Circle {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
}

const Connect = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [userCircles, setUserCircles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: Home, label: "Home", active: false, path: "/dashboard" },
    { icon: Users, label: "Connect", active: true, path: "/connect" },
    { icon: MessageSquare, label: "Kai", active: false, path: "/kai" },
    { icon: Radio, label: "Soul Stream", active: false, path: "/soul-stream" },
    { icon: Heart, label: "Connect", active: true, path: "/connect" },
    { icon: GraduationCap, label: "Learn & Grow", active: false, path: "/learn-grow" },
    { icon: Calendar, label: "Book Help", active: false, path: "/book-help" },
    { icon: User, label: "Profile", active: false, path: "/profile" },
  ];

  useEffect(() => {
    fetchCircles();
    fetchUserCircles();
  }, []);

  const fetchCircles = async () => {
    const { data, error } = await supabase
      .from("circles")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching circles:", error);
      toast({
        title: "Error",
        description: "Failed to load circles. Please try again.",
        variant: "destructive",
      });
    } else {
      setCircles(data || []);
    }
    setIsLoading(false);
  };

  const fetchUserCircles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("user_circles")
      .select("circle_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setUserCircles(new Set(data.map(uc => uc.circle_id)));
    }
  };

  const joinCircle = async (circleId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join circles.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("user_circles")
      .insert({ user_id: user.id, circle_id: circleId });

    if (error) {
      console.error("Error joining circle:", error);
      toast({
        title: "Error",
        description: "Failed to join circle. Please try again.",
        variant: "destructive",
      });
    } else {
      setUserCircles(prev => new Set([...prev, circleId]));
      toast({
        title: "Joined!",
        description: "You've joined the circle.",
      });
    }
  };

  const openCircle = (circle: Circle) => {
    if (!userCircles.has(circle.id)) {
      joinCircle(circle.id);
    }
    setSelectedCircle(circle);
  };

  if (selectedCircle) {
    return <CircleChat circle={selectedCircle} onBack={() => setSelectedCircle(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-white border-r border-[#E8DCC4] flex-col">
        <div className="p-6 border-b border-[#E8DCC4]">
          <h1 className="text-2xl font-bold text-[#4A4A4A]">Rant</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? "bg-[#FF6B35] text-white shadow-md"
                      : "text-[#6B6B6B] hover:bg-[#FDFBF7]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#4A4A4A] mb-2">Join the Conversation</h1>
            <p className="text-[#FF6B35] text-lg">Find a group that resonates with you.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {circles.map((circle) => {
                const isMember = userCircles.has(circle.id);
                return (
                  <Card
                    key={circle.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-[#E8DCC4] bg-white"
                    onClick={() => openCircle(circle)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#4A4A4A]">
                        <span className="text-3xl">{circle.icon}</span>
                        {circle.name}
                      </CardTitle>
                      <CardDescription className="text-[#FF6B35]">
                        {circle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#6B6B6B]">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{circle.member_count} members</span>
                        </div>
                        <Button
                          variant={isMember ? "secondary" : "default"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isMember) {
                              joinCircle(circle.id);
                            } else {
                              openCircle(circle);
                            }
                          }}
                          className={isMember ? "" : "bg-[#FF6B35] hover:bg-[#FF6B35]/90"}
                        >
                          {isMember ? "Open" : "Join Group"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connect;
