import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import AuthModal from "@/components/auth/AuthModal";
import rantfreeLogo from "@/assets/rantfree-logo.svg";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Blog", href: "#blog" }
  ];

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <nav 
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
            <img src={rantfreeLogo} alt="" className="w-8 h-8 rounded-lg object-cover" aria-hidden="true" />
            <span className="font-bold text-xl text-foreground">RantFree</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
                role="menuitem"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-muted"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            <Button variant="ghost" onClick={() => openAuthModal("login")}>
              Sign In
            </Button>
            <Button variant="wellness" onClick={() => openAuthModal("signup")}>
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-muted min-h-[44px] min-w-[44px]"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="min-h-[44px] min-w-[44px]"
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 text-left min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  role="menuitem"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-4">
                <Button variant="ghost" className="justify-start min-h-[44px]" onClick={() => openAuthModal("login")}>
                  Sign In
                </Button>
                <Button variant="wellness" className="justify-start min-h-[44px]" onClick={() => openAuthModal("signup")}>
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