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
}

const BookingModal = ({ isOpen, onClose, bookingType }: BookingModalProps) => {
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
      
      const { error } = await supabase.from("bookings").insert({
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        booking_type: bookingType,
        booking_date: formData.date,
        booking_time: formData.time,
        mode: formData.mode,
        notes: formData.notes,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "You're all set 💛",
        description: "Someone will reach out soon.",
        className: "bg-gradient-to-r from-[#fb971c] to-[#f05b5b] text-white border-none",
      });

      setFormData({
        name: "",
        email: "",
        date: "",
        time: "",
        mode: "",
        notes: "",
      });
      
      onClose();
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
            Book a {bookingType === "listener" ? "Listener" : "Therapist"}
          </DialogTitle>
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
