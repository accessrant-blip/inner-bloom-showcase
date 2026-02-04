import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Edit, AlertCircle, Mail, Shield, FileText, ChevronRight, Accessibility
} from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { EmergencyModal } from "@/components/profile/EmergencyModal";
import { PrivateInfoSection } from "@/components/profile/PrivateInfoSection";
import { WellnessToolkit } from "@/components/profile/WellnessToolkit";
import { AIReflection } from "@/components/profile/AIReflection";
import { SafetyPolicy } from "@/components/profile/SafetyPolicy";
import FeedbackForm from "@/components/profile/FeedbackForm";
import { AccessibilitySettings } from "@/components/accessibility/AccessibilitySettings";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await fetchProfile(session.user.id);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Take care of yourself. See you soon!",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background/50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading your peaceful space...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50">
      {/* Header */}
      <div className="bg-card/30 backdrop-blur-sm border-b border-border px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Here's your peaceful space to just be yourself</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Public Profile */}
        <Card className="rounded-3xl shadow-soft border-border animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5" />
              Public Profile
            </CardTitle>
            <CardDescription>This is how others see you in the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-foreground text-2xl">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">{profile?.username || "Anonymous"}</h3>
                <p className="text-muted-foreground mt-1">{profile?.bio || "No bio yet"}</p>
              </div>
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                className="rounded-xl border-border hover:bg-muted"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Support */}
        <Card className="rounded-3xl shadow-soft border-destructive/30 bg-destructive/5 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Need Immediate Help?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You're not alone — help is just one click away
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowEmergencyModal(true)}
                  className="rounded-xl bg-destructive hover:bg-destructive/90 text-white shadow-glow"
                >
                  Get Help Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Profile Sections */}
        <Tabs defaultValue="private-info" className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-xl h-auto p-1">
            <TabsTrigger value="private-info" className="rounded-lg text-xs sm:text-sm py-2 px-1 sm:px-3">
              Private Info
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="rounded-lg text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Accessibility className="h-4 w-4 sm:mr-1" aria-hidden="true" />
              <span className="hidden sm:inline">Accessibility</span>
            </TabsTrigger>
            <TabsTrigger value="ai-reflection" className="rounded-lg text-xs sm:text-sm py-2 px-1 sm:px-3">
              AI Reflection
            </TabsTrigger>
            <TabsTrigger value="wellness-toolkit" className="rounded-lg text-xs sm:text-sm py-2 px-1 sm:px-3">
              Wellness
            </TabsTrigger>
            <TabsTrigger value="safety-policy" className="rounded-lg text-xs sm:text-sm py-2 px-1 sm:px-3">
              Safety
            </TabsTrigger>
          </TabsList>

          <TabsContent value="private-info" className="mt-6">
            <PrivateInfoSection userId={user?.id} />
          </TabsContent>

          <TabsContent value="accessibility" className="mt-6">
            <AccessibilitySettings />
          </TabsContent>

          <TabsContent value="ai-reflection" className="mt-6">
            <AIReflection userId={user?.id} />
          </TabsContent>

          <TabsContent value="wellness-toolkit" className="mt-6">
            <WellnessToolkit />
          </TabsContent>

          <TabsContent value="safety-policy" className="mt-6">
            <SafetyPolicy />
          </TabsContent>
        </Tabs>

        {/* Feedback Form */}
        <FeedbackForm />

        {/* Quick Links */}
        <Card className="rounded-3xl shadow-soft border-border animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Support & Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link 
              to="/contact" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-foreground">Contact Us</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link 
              to="/privacy-policy" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-foreground">Privacy Policy</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link 
              to="/terms-of-service" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-foreground">Terms of Service</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        {/* Microcopy Footer */}
        <Card className="rounded-3xl shadow-soft border-border bg-primary/5">
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-foreground/70">Your wellness, your pace</p>
            <p className="text-sm text-muted-foreground">Small steps matter. You're doing better than you think.</p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <EditProfileModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onUpdate={() => fetchProfile(user.id)}
      />

      <EmergencyModal
        open={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
}