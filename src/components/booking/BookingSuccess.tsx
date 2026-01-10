import { CheckCircle, Calendar, Clock, Download, Video, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BookingSuccessProps {
  booking: {
    professional_name: string;
    booking_date: string;
    booking_time: string;
    duration: number;
    amount: number;
    booking_type: string;
    transaction_id?: string;
  };
}

const BookingSuccess = ({ booking }: BookingSuccessProps) => {
  const navigate = useNavigate();

  const addToCalendar = () => {
    const startDate = new Date(`${booking.booking_date}T${booking.booking_time}`);
    const endDate = new Date(startDate.getTime() + booking.duration * 60000);
    
    const title = `Session with ${booking.professional_name}`;
    const details = `Your ${booking.booking_type} session`;
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(details)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f2] to-[#fef5ed] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[#5c2c2c]/10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#5c2c2c] mb-2">
            Booking Confirmed
          </h1>
          <p className="text-[#7d5a5a] text-lg">
            Your session has been successfully booked!
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#fff8f2] to-white rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fb971c]/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#fb971c]" />
            </div>
            <div>
              <div className="text-sm text-[#7d5a5a] mb-1">Session Details</div>
              <div className="font-semibold text-[#5c2c2c]">
                {booking.professional_name}
              </div>
              <div className="text-[#7d5a5a] text-sm capitalize">
                {booking.booking_type} Session
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f05b5b]/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#f05b5b]" />
            </div>
            <div>
              <div className="text-sm text-[#7d5a5a] mb-1">Date & Time</div>
              <div className="font-semibold text-[#5c2c2c]">
                {formatDate(booking.booking_date)}
              </div>
              <div className="text-[#7d5a5a] text-sm">
                {formatTime(booking.booking_time)} • {booking.duration} minutes
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-[#7d5a5a] mb-1">Payment</div>
              <div className="font-semibold text-[#5c2c2c]">
                ₹{booking.amount}
              </div>
              {booking.transaction_id && (
                <div className="text-[#7d5a5a] text-xs">
                  Receipt ID: {booking.transaction_id}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Button
            onClick={addToCalendar}
            variant="outline"
            className="w-full border-2 border-[#5c2c2c]/20 hover:border-[#5c2c2c]/40 text-[#5c2c2c] font-semibold py-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Add to Calendar
          </Button>

          <Button
            className="w-full bg-gradient-to-r from-[#fb971c] to-[#f05b5b] hover:from-[#f05b5b] hover:to-[#fb971c] text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            {booking.booking_type === 'listener' ? (
              <>
                <MessageSquare className="w-5 h-5" />
                Join Chat Session
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Join Video Session
              </>
            )}
          </Button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800 text-center">
            <strong>Important:</strong> This is not an emergency service. If you're in crisis, please contact emergency helplines immediately.
          </p>
        </div>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-[#7d5a5a] hover:text-[#5c2c2c]"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
