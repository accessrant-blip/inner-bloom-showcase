import { useState } from "react";
import { Users, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BookingModal from "@/components/booking/BookingModal";

const BookHelp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"listener" | "therapist">("listener");
  const navigate = useNavigate();

  const handleBooking = (type: "listener" | "therapist") => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f2] to-[#fef5ed] font-['Poppins',_sans-serif]">
      {/* Header */}
      <header className="text-center pt-16 pb-12 px-6 animate-fade-up">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#5c2c2c]">
          Book Help 🤝
        </h1>
        <p className="text-lg md:text-xl text-[#7d5a5a] max-w-2xl mx-auto">
          Find someone to talk to — a compassionate listener or a licensed therapist.
        </p>
      </header>

      {/* Main Cards */}
      <main className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Compassionate Listeners Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in border border-[#5c2c2c]/10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#fb971c] to-[#f05b5b] flex items-center justify-center shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-[#5c2c2c] mb-4 text-center">
              Compassionate Listeners
            </h2>
            
            <p className="text-[#7d5a5a] text-center mb-6 text-lg leading-relaxed">
              They listen with empathy, not judgment.
            </p>

            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-[#fb971c] font-semibold text-lg mb-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Available Now
              </div>
              <div className="text-center text-2xl font-bold text-[#5c2c2c]">
                ₹250 <span className="text-sm font-normal text-[#7d5a5a]">for 10 minutes</span>
              </div>
            </div>
            
            <Button
              onClick={() => handleBooking("listener")}
              className="w-full bg-gradient-to-r from-[#fb971c] to-[#f05b5b] hover:from-[#f05b5b] hover:to-[#fb971c] text-white font-semibold py-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Book a Listener
            </Button>

            <p className="text-sm text-[#7d5a5a] text-center mt-6 italic px-4 leading-relaxed">
              They can't make decisions or take sides — they're here to support.
            </p>
          </div>

          {/* Licensed Therapists Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in border border-[#5c2c2c]/10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f05b5b] to-[#fb971c] flex items-center justify-center shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-[#5c2c2c] mb-4 text-center">
              Licensed Therapists
            </h2>
            
            <p className="text-[#7d5a5a] text-center mb-6 text-lg leading-relaxed">
              Find verified professionals trained to help you heal and grow.
            </p>

            <div className="mb-6">
              <div className="text-center text-2xl font-bold text-[#5c2c2c] mb-2">
                ₹1000 <span className="text-sm font-normal text-[#7d5a5a]">per session</span>
              </div>
              <div className="text-center text-sm text-[#7d5a5a]">
                Professional Care
              </div>
            </div>
            
            <Button
              onClick={() => handleBooking("therapist")}
              className="w-full bg-gradient-to-r from-[#f05b5b] to-[#fb971c] hover:from-[#fb971c] hover:to-[#f05b5b] text-white font-semibold py-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Find a Therapist
            </Button>

            <p className="text-sm text-[#7d5a5a] text-center mt-6 italic px-4 leading-relaxed">
              Licensed professionals with verified credentials.
            </p>
          </div>
        </div>
      </main>

      {/* Floating Back Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-white/90 backdrop-blur-sm text-[#5c2c2c] hover:bg-white shadow-xl rounded-full px-8 py-6 font-semibold text-lg flex items-center gap-3 border-2 border-[#5c2c2c]/20 hover:border-[#5c2c2c]/40 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Support
        </Button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingType={selectedType}
      />
    </div>
  );
};

export default BookHelp;
