import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
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
    <div className="min-h-screen bg-background/50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground mb-2">Join the Conversation</h1>
          <p className="text-primary text-lg">Find a group that resonates with you.</p>
        </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
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
                    className="hover:shadow-glow transition-all duration-300 cursor-pointer border-border bg-card animate-fade-in"
                    onClick={() => openCircle(circle)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <span className="text-3xl">{circle.icon}</span>
                        {circle.name}
                      </CardTitle>
                      <CardDescription className="text-primary">
                        {circle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{circle.member_count} members</span>
                        </div>
                        <Button
                          variant={isMember ? "secondary" : "wellness"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isMember) {
                              joinCircle(circle.id);
                            } else {
                              openCircle(circle);
                            }
                          }}
                          className="rounded-xl"
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
  );
};

export default Connect;
