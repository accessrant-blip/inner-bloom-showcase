import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Clock, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import DivyaBookingModal from "@/components/booking/DivyaBookingModal";
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
  google_form_link: string | null;
}

const ProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [showDivyaModal, setShowDivyaModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfessional();
    }
  }, [id]);

  const fetchProfessional = async () => {
    try {
      setLoading(true);
      // Use professionals_public view which excludes user_id for privacy
      const { data, error } = await supabase
        .from('professionals_public' as any)
        .select('id, name, alias, role, bio, specialties, profile_image_url, availability_status, rate_per_session, currency, is_verified, google_form_link')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfessional(data as unknown as Professional);
    } catch (error) {
      console.error('Error fetching professional:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
      navigate('/book-help');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!professional) {
    return null;
  }

  const displayName = professional.alias || professional.name;
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase();
  const isListener = professional.role === 'listener';
  const isTherapist = professional.role === 'therapist';
  const calculatedAmount = isListener ? 150 : isTherapist ? 1000 : (professional.rate_per_session / 30) * parseInt(selectedDuration);
  const statusColors = {
    online: "bg-success",
    offline: "bg-muted-foreground",
    busy: "bg-warning"
  };

  // Divya Batra configuration
  const DIVYA_CALENDLY_URL = "https://calendly.com/accessrant/30min";
  const DIVYA_GOOGLE_FORM_URL = professional?.google_form_link || "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";

  const handleBookSession = () => {
    // Check if this is Dr. Divya Batra - use multi-step booking flow
    const isDivyaBatra = professional.name.toLowerCase().includes('divya batra');
    
    if (isDivyaBatra) {
      // Open the multi-step booking modal for Divya Batra
      setShowDivyaModal(true);
      return;
    }
    
    // Default behavior for other professionals - use Google Form
    const formLink = professional.google_form_link;
    if (!formLink) {
      toast({
        title: "Booking Unavailable",
        description: "Booking form is unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    // Show toast on mobile for better UX
    if (isMobile) {
      toast({
        title: "Opening booking form…",
        description: "You'll be redirected to complete your booking.",
      });
    }
    window.open(formLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-16">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/book-help')}
          variant="ghost"
          className="mb-4 md:mb-6 text-foreground hover:text-primary min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>

        {/* Profile Card */}
        <div className="bg-card backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 shadow-soft border border-border animate-scale-in hover:shadow-glow transition-all">
          {/* Header - Mobile: Centered, Desktop: Row */}
          <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-border">
            {/* Avatar - Centered on mobile */}
            <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-primary">
              <AvatarImage src={professional.profile_image_url || ""} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground font-bold text-xl md:text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info - Centered on mobile */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  {displayName}
                </h1>
                {professional.is_verified && (
                  <Badge className="bg-primary text-primary-foreground border-none text-xs md:text-sm">
                    <Check className="w-3 h-3 mr-1" />
                    Verified {professional.role === 'therapist' ? 'Therapist' : 'Listener'}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span className={`inline-block w-3 h-3 rounded-full ${statusColors[professional.availability_status as keyof typeof statusColors]} ${professional.availability_status === 'online' ? 'animate-pulse' : ''}`}></span>
                <span className="text-muted-foreground capitalize font-medium">
                  {professional.availability_status}
                </span>
              </div>

              {/* Price Card - Full width on mobile */}
              <div className="bg-muted/50 rounded-xl p-3 md:p-0 md:bg-transparent">
                <div className="text-xl md:text-2xl font-bold text-foreground">
                  ₹{professional.rate_per_session}
                  <span className="text-sm font-normal text-muted-foreground ml-2">per session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              {professional.bio}
            </p>
          </div>

          {/* Specialties - Wrap properly */}
          {professional.specialties && professional.specialties.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs md:text-sm py-1.5 md:py-2 px-3 md:px-4 border-border text-muted-foreground bg-muted/50"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Duration Selection - Full width tappable options */}
          <div className="mb-6 md:mb-8 p-4 md:p-6 bg-muted/30 rounded-xl md:rounded-2xl">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {isListener ? 'Session Duration' : 'Select Session Duration'}
            </h2>
            {isListener ? (
              <div className="flex items-center justify-between p-4 border-2 border-success rounded-xl bg-success/5 min-h-[56px]">
                <div className="flex items-center space-x-3">
                  <span className="text-foreground font-medium">15 minutes</span>
                </div>
                <span className="text-foreground font-semibold">₹150</span>
              </div>
            ) : isTherapist ? (
              <div className="flex items-center justify-between p-4 border-2 border-success rounded-xl bg-success/5 min-h-[56px]">
                <div className="flex items-center space-x-3">
                  <span className="text-foreground font-medium">35 minutes</span>
                </div>
                <span className="text-foreground font-semibold">₹1000</span>
              </div>
            ) : (
              <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
                <div className="space-y-3">
                  {[
                    { value: "15", label: "15 minutes", price: ((professional.rate_per_session / 30) * 15).toFixed(0) },
                    { value: "30", label: "30 minutes", price: professional.rate_per_session.toString() },
                    { value: "60", label: "60 minutes", price: (professional.rate_per_session * 2).toFixed(0) },
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`duration-${option.value}`}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors min-h-[56px] ${
                        selectedDuration === option.value
                          ? "border-success bg-success/5"
                          : "border-border hover:border-success/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={`duration-${option.value}`} />
                        <span className="text-foreground font-medium">{option.label}</span>
                      </div>
                      <span className="text-foreground font-semibold">₹{option.price}</span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Offline message */}
          {professional.availability_status === 'offline' && (
            <p className="text-center text-muted-foreground text-sm mb-4">
              This professional is currently offline. Please check back later.
            </p>
          )}
        </div>
      </div>

      {/* Fixed Bottom Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pb-safe z-40">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleBookSession}
            disabled={professional.availability_status === 'offline'}
            className="w-full bg-gradient-to-r from-success to-success-hover hover:from-success-hover hover:to-success text-white font-bold py-4 md:py-6 rounded-xl md:rounded-2xl text-base md:text-lg shadow-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[56px]"
          >
            <Calendar className="w-5 h-5" />
            Book Session - ₹{calculatedAmount.toFixed(0)}
          </Button>
        </div>
      </div>

      {/* Divya Batra Multi-Step Booking Modal */}
      {professional.name.toLowerCase().includes('divya batra') && (
        <DivyaBookingModal
          isOpen={showDivyaModal}
          onClose={() => setShowDivyaModal(false)}
          googleFormUrl={DIVYA_GOOGLE_FORM_URL}
          calendlyUrl={DIVYA_CALENDLY_URL}
          professionalName={professional.alias || professional.name}
        />
      )}
    </div>
  );
};

export default ProfessionalProfile;
