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
import BookingModal from "@/components/booking/BookingModal";

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

const ProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfessional();
    }
  }, [id]);

  const fetchProfessional = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProfessional(data);
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
      <div className="min-h-screen bg-gradient-to-br from-[#fff8f2] to-[#fef5ed] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#fb971c]" />
      </div>
    );
  }

  if (!professional) {
    return null;
  }

  const displayName = professional.alias || professional.name;
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase();
  const calculatedAmount = (professional.rate_per_session / 30) * parseInt(selectedDuration);

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-yellow-500"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f2] to-[#fef5ed] font-['Poppins',_sans-serif] pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/book-help')}
          variant="ghost"
          className="mb-6 text-[#7d5a5a] hover:text-[#5c2c2c]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[#5c2c2c]/10 animate-scale-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b border-[#5c2c2c]/10">
            <Avatar className="w-24 h-24 border-4 border-[#fb971c]">
              <AvatarImage src={professional.profile_image_url || ""} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-[#fb971c] to-[#f05b5b] text-white font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-[#5c2c2c]">
                  {displayName}
                </h1>
                {professional.is_verified && (
                  <Badge className="bg-[#fb971c] text-white border-none">
                    <Check className="w-3 h-3 mr-1" />
                    Verified {professional.role === 'therapist' ? 'Therapist' : 'Listener'}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-block w-3 h-3 rounded-full ${statusColors[professional.availability_status as keyof typeof statusColors]} ${professional.availability_status === 'online' ? 'animate-pulse' : ''}`}></span>
                <span className="text-[#7d5a5a] capitalize font-medium">
                  {professional.availability_status}
                </span>
              </div>

              <div className="text-2xl font-bold text-[#5c2c2c]">
                ₹{professional.rate_per_session}
                <span className="text-sm font-normal text-[#7d5a5a] ml-2">per session</span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#5c2c2c] mb-3">About</h2>
            <p className="text-[#7d5a5a] leading-relaxed text-lg">
              {professional.bio}
            </p>
          </div>

          {/* Specialties */}
          {professional.specialties && professional.specialties.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#5c2c2c] mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-sm py-2 px-4 border-[#5c2c2c]/20 text-[#7d5a5a] bg-white/50"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Duration Selection */}
          <div className="mb-8 p-6 bg-gradient-to-br from-[#fff8f2] to-white rounded-2xl">
            <h2 className="text-xl font-bold text-[#5c2c2c] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select Session Duration
            </h2>
            <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border-2 border-[#5c2c2c]/10 rounded-xl hover:border-[#fb971c] transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="15" id="duration-15" />
                    <Label htmlFor="duration-15" className="text-[#5c2c2c] font-medium cursor-pointer">
                      15 minutes
                    </Label>
                  </div>
                  <span className="text-[#5c2c2c] font-semibold">
                    ₹{((professional.rate_per_session / 30) * 15).toFixed(0)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-[#5c2c2c]/10 rounded-xl hover:border-[#fb971c] transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="30" id="duration-30" />
                    <Label htmlFor="duration-30" className="text-[#5c2c2c] font-medium cursor-pointer">
                      30 minutes
                    </Label>
                  </div>
                  <span className="text-[#5c2c2c] font-semibold">
                    ₹{professional.rate_per_session}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-[#5c2c2c]/10 rounded-xl hover:border-[#fb971c] transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="60" id="duration-60" />
                    <Label htmlFor="duration-60" className="text-[#5c2c2c] font-medium cursor-pointer">
                      60 minutes
                    </Label>
                  </div>
                  <span className="text-[#5c2c2c] font-semibold">
                    ₹{(professional.rate_per_session * 2).toFixed(0)}
                  </span>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Book Now Button */}
          <Button
            onClick={() => setIsBookingModalOpen(true)}
            disabled={professional.availability_status === 'offline'}
            className="w-full bg-gradient-to-r from-[#fb971c] to-[#f05b5b] hover:from-[#f05b5b] hover:to-[#fb971c] text-white font-bold py-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Session - ₹{calculatedAmount.toFixed(0)}
          </Button>

          {professional.availability_status === 'offline' && (
            <p className="text-center text-[#7d5a5a] text-sm mt-3">
              This professional is currently offline. Please check back later.
            </p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingType={professional.role as "listener" | "therapist"}
        professionalId={professional.id}
        professionalName={displayName}
        duration={parseInt(selectedDuration)}
        amount={calculatedAmount}
      />
    </div>
  );
};

export default ProfessionalProfile;
