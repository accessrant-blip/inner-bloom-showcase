import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
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
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const listeners = professionals.filter(p => p.role === 'listener');
  const therapists = professionals.filter(p => p.role === 'therapist');

  return (
    <div className="min-h-screen gradient-misty font-['Poppins',_sans-serif] pb-24 page-transition">
      {/* Header */}
      <header className="text-center pt-16 pb-8 px-6 animate-fade-up">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
          Find Support You Deserve 💛
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
          Connect with compassionate listeners or licensed therapists
        </p>
        <p className="text-sm text-muted-foreground italic">
          Your feelings deserve to be heard. Safe. Private. Compassionate.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-card/80 backdrop-blur-sm p-1 rounded-2xl shadow-soft">
            <TabsTrigger 
              value="listener" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300"
            >
              Compassionate Listeners
            </TabsTrigger>
            <TabsTrigger 
              value="therapist"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-300"
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
              <TabsContent value="listener" className="mt-0">
                <div className="mb-6 text-center">
                  <p className="text-muted-foreground text-lg">
                    ₹250 for 10 minutes • They listen with empathy, not judgment
                  </p>
                </div>
                {listeners.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listeners.map((professional) => (
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

              <TabsContent value="therapist" className="mt-0">
                <div className="mb-6 text-center">
                  <p className="text-muted-foreground text-lg">
                    ₹1000 per session • Licensed professionals with verified credentials
                  </p>
                </div>
                {therapists.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {therapists.map((professional) => (
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
        <div className="mt-12 max-w-3xl mx-auto bg-warning-soft border-2 border-warning/30 rounded-2xl p-6 shadow-soft">
          <p className="text-sm text-foreground text-center leading-relaxed">
            <strong>Important Safety Notice:</strong> This is not an emergency service. If you're in crisis or experiencing thoughts of self-harm, please contact emergency helplines immediately: <strong>AASRA: 91-22-27546669</strong> or <strong>Vandrevala Foundation: 1860-2662-345</strong>
          </p>
        </div>
      </main>

      {/* Floating Back Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-card/90 backdrop-blur-sm text-foreground hover:bg-card shadow-glow rounded-full px-8 py-6 font-semibold text-lg flex items-center gap-3 border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default BookHelp;
