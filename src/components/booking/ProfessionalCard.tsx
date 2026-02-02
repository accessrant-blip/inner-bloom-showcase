import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
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

// Format name as "First L." for privacy
const formatDisplayName = (fullName: string): string => {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1]?.[0] || "";
  return `${firstName} ${lastInitial}.`;
};

// Rotating bios for listeners
const listenerBios = [
  "A calm space to talk and feel heard.",
  "Here to listen without judgment.",
  "Support when things feel heavy."
];

const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  const navigate = useNavigate();
  const isListener = professional.role === "listener";
  const isOnline = professional.availability_status === "online";
  
  // Use formatted name for listeners, full name for therapists
  const displayName = isListener 
    ? formatDisplayName(professional.name) 
    : (professional.alias || professional.name);

  // Use one of the standard bios for listeners, or use provided bio
  const displayBio = isListener 
    ? listenerBios[Math.abs(professional.name.charCodeAt(0)) % listenerBios.length]
    : professional.bio;

  // Listener-specific card (premium redesign)
  if (isListener) {
    return (
      <div className="group relative bg-card/60 backdrop-blur-xl rounded-3xl p-6 shadow-soft hover:shadow-glow transition-all duration-500 border border-border/50 h-full min-h-[320px] flex flex-col overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with Avatar */}
          <div className="flex items-start gap-4 mb-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden ring-2 ring-primary/10 ring-offset-2 ring-offset-background shadow-md">
                {professional.profile_image_url ? (
                  <img 
                    src={professional.profile_image_url} 
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-muted-foreground/60" />
                )}
              </div>
            </div>
            
            {/* Name & Role */}
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {displayName}
              </h3>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">
                Empathetic Listener
              </p>
              
              {/* Status indicator */}
              <div className="flex items-center gap-2 mt-2">
                <span 
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isOnline 
                      ? "bg-emerald-500 animate-pulse" 
                      : "bg-muted-foreground/40"
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                }`}>
                  {isOnline ? "Available now" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Bio - Single line */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-1">
            {displayBio}
          </p>

          {/* Focus Areas - Pill tags */}
          {professional.specialties && professional.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {professional.specialties.slice(0, 3).map((specialty, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted/60 text-muted-foreground border border-border/50"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex flex-col gap-1.5 mb-5 flex-grow">
            {professional.is_verified && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary/60" />
                Verified Empathetic Listener
              </p>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary/60" />
              Conversations are private
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto space-y-3">
            {/* Offline message */}
            {!isOnline && (
              <p className="text-xs text-muted-foreground text-center">
                You can view their profile or check back later.
              </p>
            )}
            
            {/* CTA Button */}
            <Button
              onClick={() => navigate(`/book-help/professional/${professional.id}`)}
              variant="wellness"
              className="w-full py-3 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 min-h-[48px] font-semibold"
            >
              {isOnline ? "Talk now" : "View profile"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Therapist card (existing design with minor refinements)
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-border animate-fade-in h-full min-h-[280px] md:min-h-[320px] flex flex-col">
      {/* Header with Avatar */}
      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden ring-2 ring-success/30 ring-offset-2 ring-offset-background shadow-md">
            {professional.profile_image_url ? (
              <img 
                src={professional.profile_image_url} 
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground/60" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap gap-1.5 md:gap-2 mb-1.5">
            <h3 className="text-lg md:text-xl font-bold text-foreground truncate">{displayName}</h3>
            {professional.is_verified && (
              <span className="bg-success text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 shadow-sm">
                Verified
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">
              Availability
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-muted-foreground text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed flex-grow">
        {professional.bio}
      </p>

      {/* Specialties */}
      {professional.specialties && professional.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
          {professional.specialties.slice(0, 3).map((specialty, index) => (
            <span 
              key={index} 
              className="px-2.5 py-0.5 text-[10px] md:text-xs rounded-full border border-border text-foreground"
            >
              {specialty}
            </span>
          ))}
          {professional.specialties.length > 3 && (
            <span className="px-2.5 py-0.5 text-[10px] md:text-xs rounded-full border border-border text-muted-foreground">
              +{professional.specialties.length - 3} more
            </span>
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
