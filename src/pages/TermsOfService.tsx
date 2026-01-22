import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Heart, UserCheck, Ban, Gavel, RefreshCw } from "lucide-react";

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: AlertTriangle,
      title: "Not a Crisis Service",
      content: [
        "RantFree is not an emergency or crisis intervention service.",
        "If you are in immediate danger or experiencing a mental health emergency, please contact emergency services (911) or a crisis hotline.",
        "Our platform is designed for emotional support, not emergency response.",
      ],
    },
    {
      icon: Heart,
      title: "Emotional Support Only",
      content: [
        "RantFree provides emotional support and a safe space to express yourself.",
        "Our services are not a substitute for professional medical advice, diagnosis, or treatment.",
        "Listeners are trained for emotional support but are not licensed therapists or medical professionals.",
        "Always consult qualified healthcare providers for medical concerns.",
      ],
    },
    {
      icon: UserCheck,
      title: "User Responsibilities",
      content: [
        "Users are responsible for maintaining the security of their account credentials.",
        "You agree to provide accurate information when creating your account.",
        "You are responsible for all activity that occurs under your account.",
        "Report any unauthorized access to your account immediately.",
      ],
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        "Harassment, bullying, or threatening behavior towards other users or listeners.",
        "Sharing or soliciting sexual content of any kind.",
        "Fraudulent activities or misrepresentation of identity.",
        "Any illegal activities or encouragement of illegal behavior.",
        "Spam, advertising, or commercial solicitation.",
        "Attempting to circumvent platform safety measures.",
      ],
    },
    {
      icon: Gavel,
      title: "Account Suspension",
      content: [
        "RantFree reserves the right to suspend or terminate accounts that violate these terms.",
        "Violations may result in immediate session termination.",
        "Repeated violations will lead to permanent account removal.",
        "Suspended users may appeal by contacting accessrant@gmail.com.",
      ],
    },
    {
      icon: RefreshCw,
      title: "Updates to Terms",
      content: [
        "These terms may be updated periodically to reflect changes in our services.",
        "Users will be notified of significant changes via email or in-app notification.",
        "Continued use of the platform after updates constitutes acceptance of new terms.",
        "We encourage users to review these terms regularly.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/30 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Terms of Service</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <p className="text-muted-foreground">
          By using RantFree, you agree to these terms. Please read them carefully 
          to understand your rights and responsibilities.
        </p>

        {sections.map((section, index) => (
          <Card key={index} className="rounded-2xl border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        <Card className="rounded-2xl border-border bg-muted/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              If you have questions about these terms, please contact us at{" "}
              <a href="mailto:accessrant@gmail.com" className="text-primary hover:underline">
                accessrant@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center pt-4">
          Last updated: January 2026
        </p>
      </div>
    </div>
  );
}
