import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, MessageSquare, BookOpen, Heart, Brain, 
  Sparkles, Wind, Users, LogOut, Menu, X, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/rant", icon: MessageSquare, label: "Rant Space" },
    { path: "/book-help", icon: Heart, label: "Book Help" },
    { path: "/kai", icon: Brain, label: "Chat with Kai" },
    { path: "/instant-relief", icon: Sparkles, label: "Instant Relief" },
    { path: "/soul-stream", icon: Wind, label: "Soul Stream" },
    { path: "/connect", icon: Users, label: "Connect" },
    { path: "/learn-grow", icon: BookOpen, label: "Learn & Grow" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out 👋",
      description: "Take care of yourself. See you soon!",
    });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card/80 backdrop-blur-sm border-r border-border transition-all duration-300 z-50 ${
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="font-semibold text-lg text-foreground">Inner Bloom</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl hover:bg-primary/10"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`w-full justify-start rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted"
                } ${!sidebarOpen && "md:justify-center"}`}
              >
                <item.icon className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border space-y-1">
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className={`w-full justify-start rounded-xl hover:bg-muted ${
                !sidebarOpen && "md:justify-center"
              }`}
            >
              <User className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`} />
              {sidebarOpen && <span>Profile</span>}
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={`w-full justify-start rounded-xl hover:bg-destructive/10 text-destructive ${
                !sidebarOpen && "md:justify-center"
              }`}
            >
              <LogOut className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`} />
              {sidebarOpen && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0 md:ml-16"
        }`}
      >
        {/* Mobile Menu Toggle */}
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-40 md:hidden rounded-xl bg-card/80 backdrop-blur-sm shadow-soft"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Page Content */}
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
