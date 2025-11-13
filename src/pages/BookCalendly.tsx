import { useParams, Navigate } from "react-router-dom";
import { CalendlyBooking } from "@/components/booking/CalendlyBooking";
import AppLayout from "@/components/layout/AppLayout";

const BookCalendly = () => {
  const { sessionType } = useParams<{ sessionType: string }>();

  if (sessionType !== "therapist" && sessionType !== "listener") {
    return <Navigate to="/book-help" replace />;
  }

  return (
    <AppLayout>
      <CalendlyBooking sessionType={sessionType} />
    </AppLayout>
  );
};

export default BookCalendly;
