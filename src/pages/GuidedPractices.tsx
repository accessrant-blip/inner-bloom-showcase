import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Instructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  tags: string[];
  profileImage: string | null;
  qualificationBadge: string;
  ctaLabel: string;
  experience?: string;
  location: string;
  formLink: string;
}

const instructors: Instructor[] = [
  {
    id: "sakshi-yoga",
    name: "Sakshi",
    role: "Yoga Instructor",
    bio: "Guiding you step by step toward strength, balance, and calm.",
    tags: ["Beginner Friendly", "Breath & Flow", "Gentle Practice"],
    profileImage: null,
    qualificationBadge: "Certified Yoga Instructor",
    ctaLabel: "Practice with Sakshi",
    experience: "5 Years Experience",
    location: "India",
    formLink: "https://docs.google.com/forms/d/YOGA_FORM_PLACEHOLDER",
  },
  {
    id: "amy-meditation",
    name: "Amy",
    role: "Meditation Instructor",
    bio: "Helping you build calm awareness through simple, grounded techniques.",
    tags: ["Mindfulness", "Stress Relief", "Guided Meditation"],
    profileImage: null,
    qualificationBadge: "Certified Meditation Guide",
    ctaLabel: "Practice with Amy",
    location: "Texas",
    formLink: "https://docs.google.com/forms/d/MEDITATION_FORM_PLACEHOLDER",
  },
];

type CardState = "idle" | "confirmation" | "notYet";

const InstructorCard = ({ instructor }: { instructor: Instructor }) => {
  const navigate = useNavigate();
  const [cardState, setCardState] = useState<CardState>(() => {
    const submitted = localStorage.getItem(`formSubmitted_${instructor.id}`);
    return submitted === "true" ? "idle" : "idle";
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOpenForm = useCallback(() => {
    window.open(instructor.formLink, "_blank");

    // Show confirmation after 10 seconds or on tab refocus
    const timeout = setTimeout(() => {
      setCardState("confirmation");
    }, 10000);

    const handleFocus = () => {
      clearTimeout(timeout);
      setCardState("confirmation");
      window.removeEventListener("focus", handleFocus);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("focus", handleFocus);
    };
  }, [instructor.formLink]);

  const handleSubmitted = () => {
    localStorage.setItem(`formSubmitted_${instructor.id}`, "true");
    setCardState("idle");
    setShowSuccessModal(true);
  };

  const handleNotYet = () => {
    setCardState("notYet");
  };

  const handleOpenFormAgain = () => {
    setCardState("idle");
    handleOpenForm();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Card */}
      <div className="group relative bg-card/60 backdrop-blur-xl rounded-3xl p-6 shadow-soft hover:shadow-glow transition-all duration-500 border border-border/50 h-full min-h-[320px] flex flex-col overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header with Avatar */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden ring-2 ring-primary/10 ring-offset-2 ring-offset-background shadow-md">
                {instructor.profileImage ? (
                  <img
                    src={instructor.profileImage}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-muted-foreground/60" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {instructor.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">
                {instructor.role}
              </p>
              {instructor.experience && (
                <p className="text-xs text-muted-foreground mt-1">
                  {instructor.experience}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-1">
            {instructor.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {instructor.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium rounded-full bg-muted/60 text-muted-foreground border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col gap-1.5 mb-5 flex-grow">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary/60" />
              {instructor.qualificationBadge}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary/60" />
              {instructor.location}
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-auto">
            <Button
              onClick={handleOpenForm}
              variant="wellness"
              className="w-full py-3 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 min-h-[48px] font-semibold"
            >
              {instructor.ctaLabel}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Card */}
      {cardState === "confirmation" && (
        <div className="bg-card/60 backdrop-blur-xl rounded-2xl p-5 shadow-soft border border-border/50 animate-fade-in">
          <h4 className="text-base font-semibold text-foreground mb-3">
            Have you completed the form?
          </h4>
          <div className="flex gap-3">
            <Button
              onClick={handleSubmitted}
              variant="wellness"
              className="flex-1 rounded-xl min-h-[44px] font-medium"
            >
              Yes, I've submitted
            </Button>
            <Button
              onClick={handleNotYet}
              variant="outline"
              className="flex-1 rounded-xl min-h-[44px] font-medium"
            >
              Not yet
            </Button>
          </div>
        </div>
      )}

      {/* Not Yet Reminder */}
      {cardState === "notYet" && (
        <div className="bg-card/60 backdrop-blur-xl rounded-2xl p-5 shadow-soft border border-border/50 animate-fade-in">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            No worries.
            <br />
            Take your time filling out the form — we'll be right here when you're done.
          </p>
          <Button
            onClick={handleOpenFormAgain}
            variant="outline"
            className="w-full rounded-xl min-h-[44px] font-medium gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Form Again
          </Button>
        </div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="rounded-2xl max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground text-center">
              You're taking a beautiful step.
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form submission confirmation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed text-center py-2">
            <p>
              Thank you for submitting your details.
              <br />
              Our team will gently review your form and verify your information.
            </p>
            <p>
              Once everything is confirmed, we'll reach out and welcome you into this journey with care.
            </p>
            <p className="text-foreground/80 font-medium">
              You don't need to do anything else right now.
              <br />
              We're glad you're here.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setShowSuccessModal(false)}
              variant="outline"
              className="flex-1 rounded-xl min-h-[44px]"
            >
              Close
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="wellness"
              className="flex-1 rounded-xl min-h-[44px]"
            >
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const GuidedPractices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background/50 px-4 py-6 md:p-6">
      <main className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-foreground">
            Guided Practices
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Simple guided practices to reconnect your mind and body.
          </p>
        </div>

        {/* Instructor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuidedPractices;
