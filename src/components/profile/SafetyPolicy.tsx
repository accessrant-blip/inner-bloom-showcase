import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SafetyPolicy = () => {
  return (
    <Card className="rounded-3xl shadow-soft border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Shield className="h-5 w-5" />
          Safety & Compassion Policy
        </CardTitle>
        <CardDescription>A safe and respectful space for everyone.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Our Promise
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2">
                Rant is a safe and confidential space built on empathy, respect, and kindness. Every interaction—whether with your AI companion, journal, or listener—should feel supportive and secure.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Code of Respect
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2">
                We do not tolerate verbal abuse, threats, harassment, or discrimination of any kind. Any conversation violating this code may be ended immediately by the listener or system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Compassionate Listener Sessions
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>Calls are strictly for emotional support, not romantic or sexual conversations.</p>
                <p>Any sexual, suggestive, or harassing language will cause the call to end instantly.</p>
                <p>Repeated violations may lead to account suspension or permanent removal.</p>
                <p>Listeners may end a call if they feel unsafe or disrespected.</p>
                <p>Calls may be monitored or recorded in anonymized form for safety reviews.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Emotional Safety
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>If a user expresses self-harm or suicidal thoughts, the app may show an immediate safety prompt with helpline options.</p>
                <p>Rant is not a crisis service.</p>
                <p>Emergency contacts and helplines are available under "Emergency Support."</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Privacy and Confidentiality
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>Private journal entries remain fully confidential.</p>
                <p>Community posts should never contain personal information.</p>
                <p>All user data is encrypted and never shared with advertisers.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Responsible Use
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>Rant is designed for self-care and reflection, not diagnosis or therapy.</p>
                <p>For clinical or medical issues, please consult a licensed professional.</p>
                <p>AI and listener responses are for support and guidance, not medical treatment.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Age and Consent
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>Users must be 13 or older (or legal age in their country) to use listener sessions.</p>
                <p>Parental guidance is recommended for ages 13–18.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Reporting and Accountability
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>Unsafe content or behavior can be reported directly in-app.</p>
                <p>Reports are reviewed confidentially within 24–48 hours.</p>
                <p>Serious or repeated violations can lead to account suspension or removal.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Inclusivity Commitment
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>Rant welcomes all users regardless of gender, identity, race, or belief.</p>
                <p>We are committed to accessibility, inclusivity, and continuous improvement.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                Policy Updates
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2 space-y-2">
                <p>Policies may be updated periodically to improve user safety.</p>
                <p>You'll receive an in-app notification whenever significant changes occur.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="bg-[#F8FAF9] rounded-xl border-[#7BB28C] px-4">
              <AccordionTrigger className="text-[#4A4A4A] font-semibold hover:no-underline">
                If You Need Help
              </AccordionTrigger>
              <AccordionContent className="text-[#4A4A4A] pt-2">
                If you feel unsafe, disrespected, or triggered during any session: End the call immediately, use the Report option, or visit Emergency Support for help. You can mail us at accessrant@gmail.com
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
