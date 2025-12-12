import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";

interface PaymentRedirectModalProps {
  open: boolean;
  onClose: () => void;
  onOpenPaymentForm: () => void;
  professionalName: string;
  amount: number;
}

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/15R3EWK0Ye1fp-1V6Q-M4-Eu2Td83oh7lU2UhgVGQ_og/viewform";

export const PaymentRedirectModal = ({ 
  open, 
  onClose, 
  onOpenPaymentForm,
  professionalName,
  amount
}: PaymentRedirectModalProps) => {
  const handleOpenPaymentForm = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
    onOpenPaymentForm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border-border max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/20 p-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Complete Your Payment
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base pt-4 space-y-3">
            <p>
              You will be redirected to a secure Google Form to submit your UPI payment for your session with <span className="font-semibold text-foreground">{professionalName}</span>.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mt-4">
              <p className="text-lg font-bold text-foreground">Amount: ₹{amount}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please upload your payment screenshot in the form
              </p>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Your booking will be confirmed once our team verifies your payment.
            </p>
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
            onClick={handleOpenPaymentForm}
            className="flex-1 bg-primary hover:bg-primary-hover gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Payment Form
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
