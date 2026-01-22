import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import rantfreeLogo from "@/assets/rantfree-logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "X (Twitter)",
      url: "https://x.com/rant_freeee",
      icon: Twitter,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/rantfree.in/",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/rantfree",
      icon: Linkedin,
    },
  ];

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={rantfreeLogo} alt="RantFree logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-xl text-foreground">RantFree</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your safe space for mental wellness. Express, heal, and grow with evidence-based tools and professional support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/emergency-support" className="text-muted-foreground hover:text-primary transition-colors">
                  Emergency Support
                </Link>
              </li>
              <li>
                <a href="mailto:support@rantfree.in" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Tooltip key={social.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on {social.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} RantFree. All rights reserved.</p>
          <p className="mt-2">
            Made with care for your mental wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
