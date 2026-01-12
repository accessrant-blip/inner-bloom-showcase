import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, MessageSquare, BookOpen, Heart, Brain, 
  Sparkles, Wind, Users, LogOut, Menu, X, User, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import rantfreeLogo from "@/assets/rantfree-logo.jpg";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/rant", icon: MessageSquare, label: "Rant Space" },
    { path: "/book-help", icon: Heart, label: "Book Help" },
    { path: "/kai", icon: Brain, label: "Chat with Kai" },
    { path: "/instant-relief", icon: Sparkles, label: "Instant Relief" },
    { path: "/soul-stream", icon: Wind, label: "Soul Stream" },
    { path: "/connect", icon: Users, label: "Connect" },
    { path: "/learn-grow", icon: BookOpen, label: "Learn & Grow" },
    { path: "/blog", icon: FileText, label: "Blog" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Take care of yourself. See you soon!",
    });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1 rounded-xl transition-all ${
              isActive(item.path)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium leading-tight">{item.label.split(' ')[0]}</span>
          </button>
        ))}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1 rounded-xl text-muted-foreground hover:text-foreground transition-all">
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium leading-tight">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-3xl pb-safe">
            <div className="py-4 space-y-2">
              <h3 className="text-lg font-semibold text-foreground mb-4 px-2">Menu</h3>
              {navItems.slice(4).map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full justify-start min-h-[48px] text-base rounded-xl ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              ))}
              <div className="border-t border-border my-4 pt-4 space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation("/profile")}
                  className={`w-full justify-start min-h-[48px] text-base rounded-xl ${
                    isActive("/profile") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Button>
                <ThemeToggle showLabel={true} className="min-h-[48px] text-base" />
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start min-h-[48px] text-base rounded-xl hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside
      className={`fixed left-0 top-0 h-full bg-card/80 backdrop-blur-sm border-r border-border transition-all duration-300 z-50 ${
        sidebarOpen ? "w-64" : "w-16"
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <img src={rantfreeLogo} alt="RantFree mental wellness app logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-semibold text-lg text-foreground">RantFree</span>
            </div>
          )}
          {!sidebarOpen && (
            <img src={rantfreeLogo} alt="RantFree logo" className="w-8 h-8 rounded-lg object-cover mx-auto" />
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
              } ${!sidebarOpen && "justify-center"}`}
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
              !sidebarOpen && "justify-center"
            }`}
          >
            <User className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`} />
            {sidebarOpen && <span>Profile</span>}
          </Button>
          <ThemeToggle showLabel={sidebarOpen} className={!sidebarOpen ? "justify-center" : ""} />
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={`w-full justify-start rounded-xl hover:bg-destructive/10 text-destructive ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <LogOut className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`} />
            {sidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && <DesktopSidebar />}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "pb-20" : sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Page Content */}
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default AppLayout;
