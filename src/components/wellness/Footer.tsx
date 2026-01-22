import { Twitter, Instagram, Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
                <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Policies</h4>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="contact" className="border-b-0">
                <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-2 hover:no-underline">
                  Contact Us
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-3">
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:accessrant@gmail.com"
                      className="text-primary hover:underline"
                    >
                      accessrant@gmail.com
                    </a>
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy" className="border-b-0">
                <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-2 hover:no-underline">
                  Privacy Policy
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-3 pb-3">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Private journal entries remain confidential and are visible only to the user.</li>
                    <li>Community posts should never contain personal identifying information.</li>
                    <li>All user data is stored securely and encrypted.</li>
                    <li>User data is never sold or shared with advertisers.</li>
                    <li>
                      Users can request deletion of their data by emailing{" "}
                      <a href="mailto:accessrant@gmail.com" className="text-primary hover:underline">
                        accessrant@gmail.com
                      </a>
                      .
                    </li>
                  </ul>

                  <div className="pt-2">
                    <p className="font-medium text-foreground mb-1">Community and Listener Conduct</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>No verbal abuse, threats, harassment, sexual content, hate speech, or discrimination.</li>
                      <li>Violations may end sessions immediately and lead to suspension or removal.</li>
                      <li>Listener can end session if unsafe.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <p className="font-medium text-foreground mb-1">Session Safety Notice</p>
                    <p>
                      If unsafe or triggered: end session, report, and contact support at{" "}
                      <a href="mailto:accessrant@gmail.com" className="text-primary hover:underline">
                        accessrant@gmail.com
                      </a>
                      .
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="terms" className="border-b-0">
                <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-2 hover:no-underline">
                  Terms of Service
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-3">
                  <ul className="list-disc list-inside space-y-1">
                    <li>RantFree is not an emergency or crisis service.</li>
                    <li>Emotional support only; not medical advice or diagnosis.</li>
                    <li>Users responsible for account safety.</li>
                    <li>Misuse prohibited (harassment, sexual content, fraud, illegal activity).</li>
                    <li>Platform may suspend accounts for violations.</li>
                    <li>Policies may update periodically.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
          <p>© {currentYear} RantFree. All rights reserved.</p>
          <p className="mt-2">
            Made with care for your mental wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
