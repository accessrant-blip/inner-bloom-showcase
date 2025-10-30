import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft, UserPlus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export default function EmergencySupport() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("I'm feeling overwhelmed and could use some support. Please check on me when you can.");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // New contact form
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await fetchContacts(session.user.id);
    setLoading(false);
  };

  const fetchContacts = async (userId: string) => {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data || []);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in name and phone number",
        variant: "destructive",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('emergency_contacts')
      .insert({
        user_id: session.user.id,
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Contact added 💚",
        description: "Your emergency contact has been saved",
      });
      setShowAddModal(false);
      setNewContact({ name: "", phone: "", relationship: "" });
      await fetchContacts(session.user.id);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Contact removed",
        description: "Emergency contact has been deleted",
      });
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchContacts(session.user.id);
    }
  };

  const handleSendAlert = () => {
    const phone = selectedContact || phoneNumber;
    
    if (!phone || phone.trim() === '') {
      toast({
        title: "No contact selected",
        description: "Please select or add a contact first",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please write an emergency message",
        variant: "destructive",
      });
      return;
    }

    // Format WhatsApp URL - keep only numbers and +
    let cleanPhone = phone.replace(/[^0-9+]/g, '');
    
    // Remove + from the number for the URL
    cleanPhone = cleanPhone.replace(/\+/g, '');
    
    // Validate phone has enough digits
    if (cleanPhone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with country code (e.g., +1234567890)",
        variant: "destructive",
      });
      return;
    }
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    try {
      window.open(whatsappUrl, '_blank');
      toast({
        title: "Opening WhatsApp 💚",
        description: "Your emergency alert is ready to send",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not open WhatsApp. Make sure you have WhatsApp installed.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <div className="text-warm-brown">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-warm pb-24">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-warm-brown/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl hover:bg-warm-brown/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-warm-brown">Emergency Support</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Message */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-warm-orange/20 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-warm-orange" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-warm-brown">Emergency Support</h2>
            <p className="text-muted-foreground mt-2">You're not alone. Help is available.</p>
          </div>
        </div>

        {/* Saved Contacts */}
        <Card className="rounded-3xl shadow-soft border-warm-brown/20 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-warm-brown">Saved Emergency Contacts</h3>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="ghost"
                className="rounded-xl hover:bg-warm-orange/10"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No contacts saved yet.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-warm-cream/30 hover:bg-warm-cream/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-warm-brown">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      {contact.relationship && (
                        <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPhoneNumber(contact.phone);
                          setSelectedContact(contact.phone);
                        }}
                        className={`rounded-xl ${
                          phoneNumber === contact.phone
                            ? "bg-[#FF8C42]/20 text-[#FF8C42]"
                            : "hover:bg-[#FF8C42]/10"
                        }`}
                      >
                        Select
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="rounded-xl hover:bg-warm-salmon/10 text-warm-salmon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Alert */}
        <Card className="rounded-3xl shadow-soft border-warm-brown/20 animate-fade-in">
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-warm-brown mb-2">Send an Alert</h3>
              <p className="text-sm text-muted-foreground">
                Select a saved contact or enter a phone number.
              </p>
            </div>

            <div className="space-y-4">
            <div>
              <Label className="text-warm-brown mb-2 block">Or enter a phone number directly</Label>
              <Input
                type="tel"
                placeholder="+1234567890 (include country code)"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setSelectedContact("");
                }}
                className="rounded-xl border-warm-brown/20 bg-warm-cream/30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g., +1 for US, +91 for India)
              </p>
            </div>

              <div>
                <Label className="text-warm-brown mb-2 block">Emergency Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'm feeling overwhelmed and could use some support. Please check on me when you can."
                  className="rounded-xl border-warm-brown/20 bg-warm-cream/30 min-h-[120px]"
                />
              </div>

              <Button
                onClick={handleSendAlert}
                disabled={!selectedContact && !phoneNumber}
                className="w-full rounded-xl bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message via WhatsApp
              </Button>

              {!selectedContact && !phoneNumber && (
                <p className="text-center text-sm text-warm-orange">
                  Please select or add a contact first
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Contact Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-warm-brown">Add Emergency Contact</DialogTitle>
            <DialogDescription>
              Save a trusted person you can reach out to in times of need.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="name" className="text-warm-brown">Name *</Label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Full name"
                className="rounded-xl border-warm-brown/20 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-warm-brown">Phone Number * (with country code)</Label>
              <Input
                id="phone"
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="+1234567890 (include country code)"
                className="rounded-xl border-warm-brown/20 mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g., +1 for US, +91 for India)
              </p>
            </div>
            <div>
              <Label htmlFor="relationship" className="text-warm-brown">Relationship</Label>
              <Input
                id="relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                placeholder="e.g., Friend, Family, Therapist"
                className="rounded-xl border-warm-brown/20 mt-1"
              />
            </div>
            <Button
              onClick={handleAddContact}
              className="w-full rounded-xl bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white font-semibold"
            >
              Save Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
