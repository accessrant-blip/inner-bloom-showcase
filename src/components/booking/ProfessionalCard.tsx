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

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-yellow-500"
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#5c2c2c]/10">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-16 h-16 border-2 border-[#fb971c]">
          <AvatarImage src={professional.profile_image_url || ""} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-[#fb971c] to-[#f05b5b] text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-[#5c2c2c]">{displayName}</h3>
            {professional.is_verified && (
              <Badge className="bg-[#fb971c] text-white border-none">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block w-2 h-2 rounded-full ${statusColors[professional.availability_status as keyof typeof statusColors]} ${professional.availability_status === 'online' ? 'animate-pulse' : ''}`}></span>
            <span className="text-[#7d5a5a] capitalize">{professional.availability_status}</span>
          </div>
        </div>
      </div>

      <p className="text-[#7d5a5a] text-sm mb-4 line-clamp-2 leading-relaxed">
        {professional.bio}
      </p>

      {professional.specialties && professional.specialties.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {professional.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs border-[#5c2c2c]/20 text-[#7d5a5a]">
              {specialty}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[#5c2c2c]/10">
        <div>
          <div className="text-2xl font-bold text-[#5c2c2c]">
            ₹{professional.rate_per_session}
          </div>
          <div className="text-xs text-[#7d5a5a]">per session</div>
        </div>

        <Button
          onClick={() => navigate(`/book-help/professional/${professional.id}`)}
          className="bg-gradient-to-r from-[#fb971c] to-[#f05b5b] hover:from-[#f05b5b] hover:to-[#fb971c] text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalCard;
