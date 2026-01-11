import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import rantfreeLogo from "@/assets/rantfree-logo.jpg";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");
  
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Blog", href: "#blog" }
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openAuthModal = (tab: "login" | "signup") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={rantfreeLogo} alt="RantFree logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-xl text-foreground">RantFree</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => openAuthModal("login")}>
              Sign In
            </Button>
            <Button variant="wellness" onClick={() => openAuthModal("signup")}>
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 text-left"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-4">
                <Button variant="ghost" className="justify-start" onClick={() => openAuthModal("login")}>
                  Sign In
                </Button>
                <Button variant="wellness" className="justify-start" onClick={() => openAuthModal("signup")}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
    </nav>
  );
};

export default Navigation;