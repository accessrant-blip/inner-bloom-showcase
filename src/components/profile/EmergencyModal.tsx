import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MessageSquare, ExternalLink, Send, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface EmergencyModalProps {
  open: boolean;
  onClose: () => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export function EmergencyModal({ open, onClose }: EmergencyModalProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [message, setMessage] = useState(
    "I'm feeling overwhelmed and could use some support. Please check on me when you can."
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open]);

  const fetchContacts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data || []);
    }
  };

  const sanitizePhone = (raw: string | null): string | null => {
    if (!raw) return null;
    // Remove non-digits
    let digits = raw.replace(/\D/g, '');
    // If 10 digits assume Indian number and prepend 91
    if (digits.length === 10) digits = '91' + digits;
    // Minimal sanity: must be >=11 digits now
    if (digits.length < 11) return null;
    return digits;
  };

  const isValidPhone = (phone: string): boolean => {
    return sanitizePhone(phone) !== null;
  };

  const handleSendAlert = (contact: EmergencyContact) => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter an emergency message before sending.",
        variant: "destructive",
      });
      return;
    }

    const phoneSanitized = sanitizePhone(contact.phone);
    
    if (!phoneSanitized) {
      toast({
        title: "Invalid Phone Number",
        description: "This contact does not have a valid phone number. Please update their phone (include country code).",
        variant: "destructive",
      });
      return;
    }
    
    const encoded = encodeURIComponent(message);
    
    // Determine URL: prefer whatsapp:// on mobile, wa.me on web
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let url = '';
    
    if (isMobile) {
      // Attempt app deep link first
      url = `whatsapp://send?phone=${phoneSanitized}&text=${encoded}`;
    } else {
      // Desktop / fallback to web
      url = `https://wa.me/${phoneSanitized}?text=${encoded}`;
    }
    
    console.log('WhatsApp URL:', url);
    
    try {
      // Open in a new tab/window (not inside iframe)
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        // Window blocked by popup blocker
        toast({
          title: "Popup Blocked",
          description: "Please allow popups or copy the link to open WhatsApp manually.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Opening WhatsApp",
        description: `Sending alert to ${contact.name}`,
      });
    } catch (err) {
      console.error('Failed to open WhatsApp URL:', err);
      // Fallback to web link
      const webUrl = `https://wa.me/${phoneSanitized}?text=${encoded}`;
      window.open(webUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Opening WhatsApp Web",
        description: `Sending alert to ${contact.name}`,
      });
    }
  };

  const handleAddContact = () => {
    window.location.href = '/emergency-support';
  };
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
      <DialogContent className="rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl">You're Not Alone</DialogTitle>
          <p className="text-muted-foreground mt-2">
            Help is available. Reach out to one of these resources — someone is ready to listen.
          </p>
        </DialogHeader>
        
        {/* Crisis Resources */}
        <div className="space-y-3 py-4">
          <h3 className="font-semibold text-foreground">Crisis Resources</h3>
          {resources.map((resource) => (
            <a
              key={resource.name}
              href={resource.link}
              className="block"
            >
              <div className="p-4 rounded-2xl border border-border hover:bg-accent hover:border-primary/40 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <p className="text-sm text-primary mt-1 font-medium">{resource.action}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <Separator />

        {/* Alert Emergency Contacts */}
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Alert Your Emergency Contacts</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddContact}
              className="rounded-xl"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Contacts
            </Button>
          </div>
          
          {contacts.length > 0 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Emergency Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your emergency message..."
                  className="rounded-xl min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Send Alert To:
                </label>
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-2xl border border-border hover:bg-accent transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {contact.relationship && `${contact.relationship} • `}
                          {contact.phone}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleSendAlert(contact)}
                        variant="default"
                        size="sm"
                        className="rounded-xl"
                        disabled={!isValidPhone(contact.phone)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send via WhatsApp
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 px-4 rounded-2xl bg-muted/50">
              <p className="text-muted-foreground mb-4">
                No emergency contacts saved yet.
              </p>
              <Button
                onClick={handleAddContact}
                variant="default"
                className="rounded-xl"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Emergency Contact
              </Button>
            </div>
          )}
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