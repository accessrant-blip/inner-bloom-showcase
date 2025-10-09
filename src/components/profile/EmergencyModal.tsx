import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, ExternalLink } from "lucide-react";

interface EmergencyModalProps {
  open: boolean;
  onClose: () => void;
}

export function EmergencyModal({ open, onClose }: EmergencyModalProps) {
  const resources = [
    {
      name: "National Crisis Hotline",
      description: "24/7 crisis support",
      icon: Phone,
      action: "Call 988",
      link: "tel:988"
    },
    {
      name: "Crisis Text Line",
      description: "Text support available",
      icon: MessageSquare,
      action: "Text HOME to 741741",
      link: "sms:741741&body=HOME"
    },
    {
      name: "Find Resources",
      description: "More support options",
      icon: ExternalLink,
      action: "View All Resources",
      link: "/resources"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-warm-brown text-2xl">You're Not Alone ❤️</DialogTitle>
          <p className="text-muted-foreground mt-2">
            Help is available. Reach out to one of these resources — someone is ready to listen.
          </p>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {resources.map((resource) => (
            <a
              key={resource.name}
              href={resource.link}
              className="block"
            >
              <div className="p-4 rounded-2xl border border-warm-brown/20 hover:bg-warm-peach/20 hover:border-warm-orange/40 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-warm-orange/10 group-hover:bg-warm-orange/20 transition-colors">
                    <resource.icon className="h-5 w-5 text-warm-orange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-warm-brown">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <p className="text-sm text-warm-orange mt-1 font-medium">{resource.action}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            If you're in immediate danger, please call emergency services (911) right away.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}