import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
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
  
  const sessionType = professional.role === 'therapist' ? 'therapist' : 'listener';

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-yellow-500"
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-border animate-fade-in">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-16 h-16 border-2 border-success">
          <AvatarImage src={professional.profile_image_url || ""} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-success to-success-hover text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
            {professional.is_verified && (
              <Badge className="bg-success text-white border-none">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block w-2 h-2 rounded-full ${statusColors[professional.availability_status as keyof typeof statusColors]} ${professional.availability_status === 'online' ? 'animate-pulse' : ''}`}></span>
            <span className="text-muted-foreground capitalize">{professional.availability_status}</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
        {professional.bio}
      </p>

      {professional.specialties && professional.specialties.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {professional.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs border-border text-foreground">
              {specialty}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <div className="text-2xl font-bold text-foreground">
            ₹{professional.rate_per_session}
          </div>
          <div className="text-xs text-muted-foreground">per session</div>
        </div>

        <Button
          onClick={() => navigate(`/book-calendly/${sessionType}`)}
          variant="wellness"
          className="px-6 py-2 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalCard;
