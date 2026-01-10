import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Professional {
  id: string;
  name: string;
  alias: string | null;
  role: string;
  bio: string;
  specialties: string[] | null;
  profile_image_url: string | null;
  availability_status: string;
  rate_per_session: number;
  currency: string;
  is_verified: boolean;
}

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  const navigate = useNavigate();
  const displayName = professional.alias || professional.name;
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase();
  const isTherapist = professional.role === "therapist";

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    busy: "bg-amber-500"
  };

  const getAvailabilityLabel = () => {
    if (isTherapist) {
      return "Availability";
    }
    return professional.availability_status;
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-border animate-fade-in h-full min-h-[280px] md:min-h-[320px] flex flex-col">
      {/* Header with Avatar */}
      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="relative flex-shrink-0">
          <Avatar className="w-16 h-16 md:w-[72px] md:h-[72px] ring-2 ring-success/30 ring-offset-2 ring-offset-background shadow-md">
            <AvatarImage 
              src={professional.profile_image_url || ""} 
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50">
              <User className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground/60" />
            </AvatarFallback>
          </Avatar>
          {/* Online indicator dot */}
          {professional.availability_status === 'online' && !isTherapist && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full animate-pulse" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap gap-1.5 md:gap-2 mb-1.5">
            <h3 className="text-lg md:text-xl font-bold text-foreground truncate">{displayName}</h3>
            {professional.is_verified && (
              <Badge className="bg-success text-white border-none text-xs flex-shrink-0 shadow-sm">
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {isTherapist ? (
              <span className="text-muted-foreground font-medium">
                {getAvailabilityLabel()}
              </span>
            ) : (
              <>
                <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${statusColors[professional.availability_status as keyof typeof statusColors]} ${professional.availability_status === 'online' ? 'animate-pulse' : ''}`}></span>
                <span className="text-muted-foreground capitalize">{getAvailabilityLabel()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-muted-foreground text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed flex-grow">
        {professional.bio}
      </p>

      {/* Specialties - Wrap properly */}
      {professional.specialties && professional.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
          {professional.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-[10px] md:text-xs border-border text-foreground">
              {specialty}
            </Badge>
          ))}
          {professional.specialties.length > 3 && (
            <Badge variant="outline" className="text-[10px] md:text-xs border-border text-muted-foreground">
              +{professional.specialties.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {/* Footer with Price and Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 md:pt-4 border-t border-border mt-auto">
        <div>
          <div className="text-xl md:text-2xl font-bold text-foreground">
            ₹{professional.rate_per_session}
          </div>
          <div className="text-xs text-muted-foreground">per session</div>
        </div>

        <Button
          onClick={() => navigate(`/book-help/professional/${professional.id}`)}
          variant="wellness"
          className="w-full sm:w-auto px-4 md:px-6 py-2 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 min-h-[44px]"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalCard;
