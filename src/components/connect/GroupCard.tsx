import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, Calendar } from "lucide-react";
import { formatDistanceToNow, format, isPast } from "date-fns";

export interface Circle {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
  topic?: string;
  capacity?: number;
  next_session_at?: string;
  is_active?: boolean;
}

interface GroupCardProps {
  circle: Circle;
  isMember: boolean;
  onJoin: (circleId: string) => void;
  onOpen: (circle: Circle) => void;
}

const GroupCard = ({ circle, isMember, onJoin, onOpen }: GroupCardProps) => {
  const capacity = circle.capacity || 20;
  const memberCount = circle.member_count || 0;
  const capacityPercentage = Math.min((memberCount / capacity) * 100, 100);
  const isFull = memberCount >= capacity;

  const formatNextSession = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isPast(date)) return "Session in progress";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getCapacityColor = () => {
    if (capacityPercentage >= 90) return "bg-destructive";
    if (capacityPercentage >= 70) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <Card
      className="hover:shadow-glow transition-all duration-300 cursor-pointer border-border bg-card animate-fade-in group"
      onClick={() => onOpen(circle)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {circle.icon}
            </span>
            <div>
              <CardTitle className="text-foreground text-lg">{circle.name}</CardTitle>
              {circle.topic && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {circle.topic}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-muted-foreground mt-2 line-clamp-2">
          {circle.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Member count with capacity bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {memberCount}/{capacity} members
              </span>
            </div>
            {isFull && (
              <Badge variant="destructive" className="text-xs">
                Full
              </Badge>
            )}
          </div>
          <Progress 
            value={capacityPercentage} 
            className="h-2"
            indicatorClassName={getCapacityColor()}
          />
        </div>

        {/* Next session time */}
        {circle.next_session_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatNextSession(circle.next_session_at)}</span>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-end pt-2">
          <Button
            variant={isMember ? "secondary" : "wellness"}
            size="sm"
            disabled={isFull && !isMember}
            onClick={(e) => {
              e.stopPropagation();
              if (!isMember && !isFull) {
                onJoin(circle.id);
              } else if (isMember) {
                onOpen(circle);
              }
            }}
            className="rounded-xl"
          >
            {isMember ? "Open Chat" : isFull ? "Full" : "Join Group"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
