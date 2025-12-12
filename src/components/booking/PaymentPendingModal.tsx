import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface PaymentPendingModalProps {
  open: boolean;
  onClose: () => void;
  professionalName: string;
}

export const PaymentPendingModal = ({ 
  open, 
  onClose, 
  professionalName
}: PaymentPendingModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border-border max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-amber-500/20 p-4">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Payment Verification Pending
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base pt-4 space-y-3">
            <p>
              Thank you for submitting your payment for the session with <span className="font-semibold text-foreground">{professionalName}</span>.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Our team is verifying your payment. You will receive a notification once your booking is confirmed.
              </p>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              This usually takes 15-30 minutes during business hours.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            onClick={onClose}
            className="px-8 bg-primary hover:bg-primary-hover"
          >
            Got it
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
