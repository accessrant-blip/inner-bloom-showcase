import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Edit, AlertCircle, Lock, Wind, Sprout, 
  BookOpen, Bell, TrendingUp, Gamepad2, RefreshCw, LogOut, Heart, ArrowLeft
} from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { EmergencyModal } from "@/components/profile/EmergencyModal";
import { PrivateInfoSection } from "@/components/profile/PrivateInfoSection";
import { WellnessToolkit } from "@/components/profile/WellnessToolkit";
import { AIReflection } from "@/components/profile/AIReflection";

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
      title: "Signed out 👋",
      description: "Take care of yourself. See you soon!",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <div className="text-warm-brown">Loading your peaceful space...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-warm pb-24">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-warm-brown/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl hover:bg-warm-brown/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-warm-brown">Your Profile 💫</h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="rounded-xl hover:bg-warm-brown/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Message */}
        <Card className="rounded-3xl shadow-soft border-warm-brown/20 bg-gradient-to-br from-warm-cream to-white">
          <CardContent className="pt-6 text-center">
            <p className="text-warm-brown/80 text-lg">
              Here's your peaceful space to just be yourself 💫
            </p>
          </CardContent>
        </Card>

        {/* Public Profile */}
        <Card className="rounded-3xl shadow-soft border-warm-brown/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warm-brown">
              <User className="h-5 w-5" />
              Public Profile
            </CardTitle>
            <CardDescription>This is how others see you in the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-warm-orange/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-warm-peach text-warm-brown text-2xl">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-warm-brown">{profile?.username || "Anonymous"}</h3>
                <p className="text-muted-foreground mt-1">{profile?.bio || "No bio yet"}</p>
              </div>
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                className="rounded-xl border-warm-orange/30 hover:bg-warm-orange/10"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Support */}
        <Card className="rounded-3xl shadow-soft border-warm-salmon/30 bg-gradient-to-br from-warm-salmon/10 to-white animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-warm-brown flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warm-salmon" />
                  Need Immediate Help?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You're not alone — help is just one click away ❤️
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowEmergencyModal(true)}
                  className="rounded-xl bg-warm-salmon hover:bg-warm-salmon/90 text-white shadow-glow"
                >
                  Get Help Now
                </Button>
                <Button
                  onClick={() => navigate("/emergency-support")}
                  variant="outline"
                  className="rounded-xl border-warm-salmon/30 hover:bg-warm-salmon/10"
                >
                  Access Emergency Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Private Info */}
        <PrivateInfoSection userId={user?.id} />

        {/* AI Reflection */}
        <AIReflection userId={user?.id} />

        {/* Wellness Toolkit */}
        <WellnessToolkit />

        {/* Microcopy Footer */}
        <Card className="rounded-3xl shadow-soft border-warm-brown/20 bg-gradient-to-br from-warm-peach/20 to-white">
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-warm-brown/70">Your wellness, your pace 🌸</p>
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