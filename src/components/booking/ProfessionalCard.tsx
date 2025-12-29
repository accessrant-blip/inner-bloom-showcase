import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-yellow-500"
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-border animate-fade-in h-full min-h-[280px] md:min-h-[320px] flex flex-col">
      {/* Header with Avatar */}
      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        <Avatar className="w-12 h-12 md:w-16 md:h-16 border-2 border-success flex-shrink-0">
          <AvatarImage src={professional.profile_image_url || ""} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-success to-success-hover text-white font-semibold text-sm md:text-base">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap gap-1.5 md:gap-2 mb-1">
            <h3 className="text-lg md:text-xl font-bold text-foreground truncate">{displayName}</h3>
            {professional.is_verified && (
              <Badge className="bg-success text-white border-none text-xs flex-shrink-0">
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${statusColors[professional.availability_status as keyof typeof statusColors]} ${professional.availability_status === 'online' ? 'animate-pulse' : ''}`}></span>
            <span className="text-muted-foreground capitalize">{professional.availability_status}</span>
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
