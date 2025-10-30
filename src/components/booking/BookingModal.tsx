import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: "listener" | "therapist";
  professionalId?: string;
  professionalName?: string;
  duration?: number;
  amount?: number;
}

const BookingModal = ({ 
  isOpen, 
  onClose, 
  bookingType, 
  professionalId,
  professionalName,
  duration = 30,
  amount 
}: BookingModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    mode: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to book a session",
          variant: "destructive",
        });
        return;
      }

      if (!professionalId) {
        toast({
          title: "Error",
          description: "Professional not selected",
          variant: "destructive",
        });
        return;
      }

      const calculatedAmount = amount || (bookingType === "listener" ? 250 : 1000);

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          professional_id: professionalId,
          name: formData.name,
          email: formData.email,
          booking_date: formData.date,
          booking_time: formData.time,
          booking_type: bookingType,
          mode: formData.mode,
          notes: formData.notes,
          duration: duration,
          amount: calculatedAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          booking_id: booking.id,
          user_id: user.id,
          professional_id: professionalId,
          amount: calculatedAmount,
          currency: 'INR',
          payment_method: 'pending',
          payment_status: 'pending',
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Success!",
        description: "Your booking has been confirmed. Proceeding to payment...",
      });

      // Here you would normally redirect to payment gateway
      // For now, we'll just show success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          date: "",
          time: "",
          mode: "",
          notes: "",
        });
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#fff8f2] border-2 border-[#5c2c2c]/20 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#5c2c2c] text-center">
            Book Session{professionalName ? ` with ${professionalName}` : ''}
          </DialogTitle>
          {(duration || amount) && (
            <p className="text-[#7d5a5a] text-center mt-2">
              {duration} minutes • ₹{amount || (bookingType === "listener" ? 250 : 1000)}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className="text-[#5c2c2c] font-semibold">
              Name *
            </Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 border-[#5c2c2c]/30 focus:border-[#fb971c] rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[#5c2c2c] font-semibold">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 border-[#5c2c2c]/30 focus:border-[#fb971c] rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-[#5c2c2c] font-semibold">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 border-[#5c2c2c]/30 focus:border-[#fb971c] rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-[#5c2c2c] font-semibold">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1 border-[#5c2c2c]/30 focus:border-[#fb971c] rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mode" className="text-[#5c2c2c] font-semibold">
              Mode *
            </Label>
            <Select required value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
              <SelectTrigger className="mt-1 border-[#5c2c2c]/30 focus:border-[#fb971c] rounded-xl">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-[#fff8f2] border-[#5c2c2c]/20">
                <SelectItem value="audio">Audio Call</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes" className="text-[#5c2c2c] font-semibold">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any specific concerns or preferences..."
              className="mt-1 border-[#5c2c2c]/30 focus:border-[#fb971c] rounded-xl min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#fb971c] to-[#f05b5b] hover:from-[#f05b5b] hover:to-[#fb971c] text-white font-semibold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
