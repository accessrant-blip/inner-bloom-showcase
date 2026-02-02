import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import ProfessionalCard from "@/components/booking/ProfessionalCard";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: string;
  name: string;
  alias: string | null;
  role: string;
  bio: string;
  specialties: string[] | null;
  profile_image_url: string | null;
  availability_status: string;
  rate_per_session: number;
  currency: string;
  is_verified: boolean;
}

const BookHelp = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listener");
  const { toast } = useToast();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name, alias, role, bio, specialties, profile_image_url, availability_status, rate_per_session, currency, is_verified, google_form_link')
        .eq('is_active', true)
        .order('availability_status', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Error",
        description: "Failed to load professionals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const listeners = professionals.filter(p => p.role === 'listener');
  const therapists = professionals.filter(p => p.role === 'therapist');

  return (
    <div className="min-h-screen bg-background/50 px-4 py-6 md:p-6">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-foreground">
            Find Support You Deserve 💛
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-1">
            Connect with compassionate listeners or licensed therapists
          </p>
          <p className="text-xs md:text-sm text-muted-foreground italic">
            Your feelings deserve to be heard. Safe. Private. Compassionate.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 md:mb-8 bg-card/80 backdrop-blur-sm p-1 rounded-xl md:rounded-2xl shadow-soft h-auto">
            <TabsTrigger 
              value="listener" 
              className="rounded-lg md:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300 text-xs md:text-sm py-2.5 md:py-2 px-2 min-h-[44px]"
            >
              Empathetic Listeners
            </TabsTrigger>
            <TabsTrigger 
              value="therapist" 
              className="rounded-lg md:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300 text-xs md:text-sm py-2.5 md:py-2 px-2 min-h-[44px]"
            >
              Licensed Therapists
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="listener" className="mt-0 animate-fade-in">
                <div className="mb-4 md:mb-6 text-center">
                  <p className="text-muted-foreground text-sm md:text-lg">
                    A safe space to be heard. No judgment, just support.
                  </p>
                </div>
                {listeners.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {listeners.map(professional => (
                      <ProfessionalCard key={professional.id} professional={professional} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg">No listeners available at the moment.</p>
                    <p className="text-sm mt-2">Please check back soon.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="therapist" className="mt-0 animate-fade-in">
                <div className="mb-4 md:mb-6 text-center">
                  <p className="text-muted-foreground text-sm md:text-lg">
                    ₹1000 per session • Licensed professionals with verified credentials
                  </p>
                </div>
                {therapists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {therapists.map(professional => (
                      <ProfessionalCard key={professional.id} professional={professional} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg">No therapists available at the moment.</p>
                    <p className="text-sm mt-2">Please check back soon.</p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Safety Disclaimer */}
        <div className="mt-8 md:mt-12 max-w-3xl mx-auto bg-warning/10 border border-warning/30 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft">
          <p className="text-xs md:text-sm text-foreground leading-relaxed text-left">
            <strong>Important Safety Notice:</strong> This is not an emergency service. If you're in crisis or experiencing thoughts of self-harm, please contact emergency helplines immediately: <strong>AASRA: 91-22-27546669</strong> or <strong>Vandrevala Foundation: 1860-2662-345</strong>
          </p>
        </div>
      </main>
    </div>
  );
};

export default BookHelp;
