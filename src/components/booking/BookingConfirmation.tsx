import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface BookingConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  professionalName: string;
}

export const BookingConfirmation = ({ open, onClose, onConfirm, professionalName }: BookingConfirmationProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/20 p-3">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Booking Confirmed
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg pt-4">
            {professionalName} will connect with you shortly via voice call.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-primary hover:bg-primary-hover"
          >
            Join Call
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};