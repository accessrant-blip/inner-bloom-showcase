import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Users, Database, Trash2 } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Lock,
      title: "Journal Confidentiality",
      content: [
        "Private journal entries remain confidential and are visible only to the user.",
        "Your personal reflections are never shared with other users or third parties.",
        "Journal data is encrypted both in transit and at rest.",
      ],
    },
    {
      icon: Users,
      title: "Community Safety",
      content: [
        "Community posts should never contain personal identifying information.",
        "No verbal abuse, threats, harassment, sexual content, hate speech, or discrimination is tolerated.",
        "Violations may result in immediate session termination and account suspension.",
        "Listeners can end sessions if they feel unsafe.",
      ],
    },
    {
      icon: Database,
      title: "Data Security",
      content: [
        "All user data is stored securely using industry-standard encryption.",
        "We use secure, encrypted connections for all data transmission.",
        "Regular security audits are conducted to ensure data protection.",
        "Access to user data is strictly limited to essential personnel.",
      ],
    },
    {
      icon: Shield,
      title: "No Advertiser Sharing",
      content: [
        "User data is never sold or shared with advertisers.",
        "We do not use your data for targeted advertising.",
        "Your privacy is our priority, not profit from your information.",
      ],
    },
    {
      icon: Trash2,
      title: "Data Deletion",
      content: [
        "Users can request deletion of their data at any time.",
        "To request data deletion, email us at accessrant@gmail.com.",
        "Deletion requests are processed within 30 days.",
        "Upon deletion, all personal data is permanently removed from our systems.",
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
          <h1 className="text-xl font-semibold text-foreground">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <p className="text-muted-foreground">
          At RantFree, we are committed to protecting your privacy and ensuring 
          your personal information is handled with care and respect.
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

        {/* Session Safety Notice */}
        <Card className="rounded-2xl border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-foreground font-medium mb-2">Session Safety Notice</p>
            <p className="text-muted-foreground text-sm">
              If you ever feel unsafe or triggered during a session, you can end the session 
              immediately, report the incident, and contact support at{" "}
              <a href="mailto:accessrant@gmail.com" className="text-primary hover:underline">
                accessrant@gmail.com
              </a>.
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
