import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Users, AlertCircle, RefreshCw } from "lucide-react";
import CircleChat from "@/components/connect/CircleChat";
import GroupCard, { Circle } from "@/components/connect/GroupCard";

const TOPICS = [
  "All",
  "Anxiety",
  "Depression",
  "Stress",
  "Grief",
  "Self-Care",
  "Mindfulness",
  "Sleep",
  "Work",
  "Relationships",
  "Burnout",
  "Social Anxiety",
  "Positivity",
];

const Connect = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [filteredCircles, setFilteredCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [userCircles, setUserCircles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const { toast } = useToast();

  useEffect(() => {
    fetchCircles();
    fetchUserCircles();
  }, []);

  useEffect(() => {
    filterCircles();
  }, [circles, searchQuery, selectedTopic]);

  const fetchCircles = async () => {
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await supabase
      .from("circles")
      .select("*")
      .eq("is_active", true)
      .order("next_session_at", { ascending: true });

    if (error) {
      console.error("Error fetching circles:", error);
      setError("Failed to load groups. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
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

  const filterCircles = () => {
    let filtered = [...circles];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (circle) =>
          circle.name.toLowerCase().includes(query) ||
          circle.description.toLowerCase().includes(query) ||
          circle.topic?.toLowerCase().includes(query)
      );
    }

    // Filter by topic
    if (selectedTopic !== "All") {
      filtered = filtered.filter((circle) => circle.topic === selectedTopic);
    }

    setFilteredCircles(filtered);
  };

  const joinCircle = async (circleId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join groups.",
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
        description: "Failed to join group. Please try again.",
        variant: "destructive",
      });
    } else {
      setUserCircles(prev => new Set([...prev, circleId]));
      // Refresh circles to get updated member count
      fetchCircles();
      toast({
        title: "Joined!",
        description: "You've joined the group.",
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
    return <CircleChat circle={selectedCircle} onBack={() => {
      setSelectedCircle(null);
      fetchCircles(); // Refresh on back to get updated counts
    }} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Conversational Groups
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find a supportive community that resonates with you.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          
          {/* Topic filters */}
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTopic === topic
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                }`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchCircles} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4 p-6 border border-border rounded-xl bg-card">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCircles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No groups found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedTopic !== "All"
                ? "Try adjusting your search or filters"
                : "No groups are available right now"}
            </p>
            {(searchQuery || selectedTopic !== "All") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTopic("All");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Groups Grid */}
        {!isLoading && !error && filteredCircles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCircles.map((circle) => (
              <GroupCard
                key={circle.id}
                circle={circle}
                isMember={userCircles.has(circle.id)}
                onJoin={joinCircle}
                onOpen={openCircle}
              />
            ))}
          </div>
        )}

        {/* Stats footer */}
        {!isLoading && !error && circles.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredCircles.length} of {circles.length} groups
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;
