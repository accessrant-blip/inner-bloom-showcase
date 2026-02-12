import { useState, useCallback } from "react";
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
    formLink: "https://docs.google.com/forms/d/15R3EWK0Ye1fp-1V6Q-M4-Eu2Td83oh7lU2UhgVGQ_og/viewform",
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
    formLink: "https://docs.google.com/forms/d/15R3EWK0Ye1fp-1V6Q-M4-Eu2Td83oh7lU2UhgVGQ_og/viewform",
  },
];

type CardState = "idle" | "confirmation" | "notYet";

const InstructorCard = ({ instructor }: { instructor: Instructor }) => {
  const navigate = useNavigate();
  const [cardState, setCardState] = useState<CardState>("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOpenForm = useCallback(() => {
    window.open(instructor.formLink, "_blank");

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
    <div className="flex flex-col">
      {/* Main Card */}
      <div className="bg-card/40 backdrop-blur-md rounded-2xl p-5 border border-border/30 h-full flex flex-col animate-fade-in">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-muted/40 flex items-center justify-center overflow-hidden ring-1 ring-border/30">
            {instructor.profileImage ? (
              <img
                src={instructor.profileImage}
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-muted-foreground/50" />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              {instructor.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {instructor.role}
            </p>
            {instructor.experience && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                {instructor.experience}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {instructor.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {instructor.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-muted/40 text-muted-foreground/80 border border-border/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col gap-1 mb-5 flex-grow">
          <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            {instructor.qualificationBadge}
          </p>
          <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            {instructor.location}
          </p>
        </div>

        {/* CTA + inline confirmation */}
        <div className="mt-auto space-y-3">
          <button
            onClick={handleOpenForm}
            className="w-full h-[44px] rounded-xl bg-primary/85 text-primary-foreground font-medium text-sm transition-colors duration-200 hover:bg-primary/75"
          >
            {instructor.ctaLabel}
          </button>

          {/* Inline confirmation */}
          {cardState === "confirmation" && (
            <div className="animate-fade-in pt-1">
              <p className="text-xs text-muted-foreground mb-2 text-center">
                Have you submitted the form?
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSubmitted}
                  className="h-[36px] px-4 rounded-full bg-primary/80 text-primary-foreground text-xs font-medium transition-colors duration-200 hover:bg-primary/70"
                >
                  Yes, submitted
                </button>
                <button
                  onClick={handleNotYet}
                  className="h-[36px] px-4 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium border border-border/30 transition-colors duration-200 hover:bg-muted/70"
                >
                  Not yet
                </button>
              </div>
            </div>
          )}

          {/* Not Yet inline */}
          {cardState === "notYet" && (
            <div className="animate-fade-in pt-1 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                No worries — take your time. We'll be here.
              </p>
              <button
                onClick={handleOpenFormAgain}
                className="h-[36px] px-4 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium border border-border/30 transition-colors duration-200 hover:bg-muted/70 inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                Open Form Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="rounded-2xl max-w-sm mx-auto border-border/30 bg-gradient-to-b from-card to-background/95 backdrop-blur-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground text-center">
              You're on your way.
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form submission confirmation
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground leading-relaxed text-center py-3">
            <p>
              Thank you for taking this step. Our team will review your form and reach out shortly.
              We're excited to guide you on this journey.
            </p>
          </div>
          <div className="pt-1 flex justify-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="h-[44px] px-8 rounded-xl bg-primary/85 text-primary-foreground text-sm font-medium transition-colors duration-200 hover:bg-primary/75"
            >
              Okay
            </button>
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
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-foreground tracking-tight">
            Guided Practices
          </h1>
          <p className="text-base text-muted-foreground">
            Simple guided practices to reconnect your mind and body.
          </p>
        </div>

        {/* Instructor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuidedPractices;
