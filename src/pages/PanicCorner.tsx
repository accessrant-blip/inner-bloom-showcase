import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "reassure" | "breathing" | "grounding" | "sensory" | "calm";

const INHALE_DURATION = 4000;
const EXHALE_DURATION = 7000;
const TOTAL_BREATH_CYCLES = 5;

const GROUND_HOLD = 5000;
const GROUND_RELEASE = 2000;
const TOTAL_GROUND_REPS = 3;

const PanicCorner = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("reassure");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg mx-auto">
        {step === "reassure" && <ReassureStep onNext={() => setStep("breathing")} />}
        {step === "breathing" && <BreathingStep onNext={() => setStep("grounding")} />}
        {step === "grounding" && <GroundingStep onNext={() => setStep("sensory")} />}
        {step === "sensory" && <SensoryStep onNext={() => setStep("calm")} />}
        {step === "calm" && <CalmStep onRestart={() => setStep("reassure")} onGoBack={() => navigate(-1)} />}
      </div>
    </div>
  );
};

/* ─── Step 1: Reassurance ─── */
const ReassureStep = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col items-center text-center space-y-10 animate-fade-in" role="region" aria-label="Reassurance">
    <h1 className="text-3xl md:text-4xl font-semibold text-foreground leading-tight">
      This is panic.<br />Not danger.
    </h1>
    <p className="text-xl md:text-2xl text-muted-foreground font-medium">
      You are safe right now.
    </p>
    <Button
      onClick={onNext}
      size="lg"
      className="rounded-2xl px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft transition-all duration-300 min-h-[56px]"
      aria-label="Acknowledge and continue"
    >
      I'm here
    </Button>
  </div>
);

/* ─── Step 2: Breathing ─── */
const BreathingStep = ({ onNext }: { onNext: () => void }) => {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCycle = useCallback((currentCycle: number) => {
    if (currentCycle >= TOTAL_BREATH_CYCLES) {
      setDone(true);
      return;
    }
    setCycle(currentCycle);
    setPhase("inhale");
    timerRef.current = setTimeout(() => {
      setPhase("exhale");
      timerRef.current = setTimeout(() => {
        runCycle(currentCycle + 1);
      }, EXHALE_DURATION);
    }, INHALE_DURATION);
  }, []);

  useEffect(() => {
    runCycle(0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [runCycle]);

  const circleSize = phase === "inhale" ? "scale-100" : "scale-[0.55]";

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-fade-in" role="region" aria-live="polite" aria-label="Guided breathing exercise">
      <h2 className="text-2xl font-semibold text-foreground">Breathe with me</h2>
      {!done ? (
        <>
          <div className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56">
            <div
              className={`w-full h-full rounded-full bg-primary/15 border-2 border-primary/30 transition-transform ${
                phase === "inhale" ? "duration-[4000ms]" : "duration-[7000ms]"
              } ease-in-out ${circleSize}`}
              aria-hidden="true"
            />
            <span className="absolute text-lg font-medium text-foreground">
              {phase === "inhale" ? "Breathe in" : "Breathe out"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {phase === "inhale" ? "Through your nose, 4 seconds" : "Through your mouth, 7 seconds"}
          </p>
          <p className="text-xs text-muted-foreground">{cycle + 1} of {TOTAL_BREATH_CYCLES}</p>
        </>
      ) : (
        <div className="space-y-6">
          <p className="text-lg text-foreground font-medium">Well done. Your breathing is steadier now.</p>
          <Button
            onClick={onNext}
            size="lg"
            className="rounded-2xl px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft min-h-[56px]"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

/* ─── Step 3: Body Grounding ─── */
const GroundingStep = ({ onNext }: { onNext: () => void }) => {
  const [rep, setRep] = useState(0);
  const [holding, setHolding] = useState(true);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runRep = useCallback((currentRep: number) => {
    if (currentRep >= TOTAL_GROUND_REPS) {
      setDone(true);
      return;
    }
    setRep(currentRep);
    setHolding(true);
    timerRef.current = setTimeout(() => {
      setHolding(false);
      timerRef.current = setTimeout(() => {
        runRep(currentRep + 1);
      }, GROUND_RELEASE);
    }, GROUND_HOLD);
  }, []);

  useEffect(() => {
    runRep(0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [runRep]);

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-fade-in" role="region" aria-live="polite" aria-label="Body grounding exercise">
      <h2 className="text-2xl font-semibold text-foreground">Feel your body</h2>
      {!done ? (
        <>
          <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
            holding
              ? "bg-primary/20 border-2 border-primary/40 scale-105"
              : "bg-muted border-2 border-border scale-95"
          }`} aria-hidden="true">
            <span className="text-lg font-medium text-foreground">
              {holding ? "Press feet down" : "Release"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {holding ? "Press your feet firmly into the floor" : "Gently release the pressure"}
          </p>
          <p className="text-xs text-muted-foreground">{rep + 1} of {TOTAL_GROUND_REPS}</p>
        </>
      ) : (
        <div className="space-y-6">
          <p className="text-lg text-foreground font-medium">Good. You are connected to your body.</p>
          <Button
            onClick={onNext}
            size="lg"
            className="rounded-2xl px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft min-h-[56px]"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

/* ─── Step 4: Sensory Grounding ─── */
const SensoryStep = ({ onNext }: { onNext: () => void }) => {
  const [substep, setSubstep] = useState(0);
  const prompts = [
    { instruction: "Look around and name 3 things you can see.", count: 3, sense: "see" },
    { instruction: "Listen closely. Name 2 things you can hear.", count: 2, sense: "hear" },
    { instruction: "Notice 1 physical sensation in your body right now.", count: 1, sense: "feel" },
  ];
  const [inputs, setInputs] = useState<string[]>([]);
  const current = prompts[substep];

  const handleAdd = (value: string) => {
    if (!value.trim()) return;
    const next = [...inputs, value];
    setInputs(next);
    if (next.length >= current.count) {
      if (substep < prompts.length - 1) {
        setTimeout(() => {
          setSubstep(substep + 1);
          setInputs([]);
        }, 400);
      } else {
        setTimeout(onNext, 600);
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-fade-in" role="region" aria-live="polite" aria-label="Sensory grounding exercise">
      <h2 className="text-2xl font-semibold text-foreground">Ground your senses</h2>
      <p className="text-lg text-muted-foreground max-w-sm">{current.instruction}</p>
      <div className="w-full max-w-xs space-y-3">
        {Array.from({ length: current.count }).map((_, i) => (
          <SensoryInput
            key={`${substep}-${i}`}
            index={i}
            filled={i < inputs.length}
            value={inputs[i] || ""}
            active={i === inputs.length}
            onSubmit={handleAdd}
            sense={current.sense}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Step {substep + 1} of {prompts.length}</p>
    </div>
  );
};

const SensoryInput = ({
  index, filled, value, active, onSubmit, sense,
}: {
  index: number; filled: boolean; value: string; active: boolean; onSubmit: (v: string) => void; sense: string;
}) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active && inputRef.current) inputRef.current.focus();
  }, [active]);

  if (filled) {
    return (
      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-left text-sm animate-fade-in">
        {value}
      </div>
    );
  }
  if (!active) {
    return <div className="p-3 rounded-xl bg-muted/50 border border-border text-muted-foreground text-left text-sm" aria-hidden="true" />;
  }
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(text); setText(""); }}
      className="flex gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Something you ${sense}...`}
        aria-label={`Enter something you ${sense}, item ${index + 1}`}
        className="flex-1 p-3 rounded-xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]"
      />
      <Button type="submit" size="sm" className="rounded-xl min-h-[48px] px-4 bg-primary text-primary-foreground" disabled={!text.trim()}>
        OK
      </Button>
    </form>
  );
};

/* ─── Step 5: Post-calm ─── */
const CalmStep = ({ onRestart, onGoBack }: { onRestart: () => void; onGoBack: () => void }) => (
  <div className="flex flex-col items-center text-center space-y-8 animate-fade-in" role="region" aria-label="Post-calm reassurance">
    <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
      Panic always passes.
    </h2>
    <p className="text-lg text-muted-foreground max-w-sm">
      You have survived every panic attack before. You survived this one too.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
      <Button
        onClick={onRestart}
        variant="outline"
        size="lg"
        className="rounded-2xl flex-1 min-h-[56px] border-border text-foreground hover:bg-accent"
      >
        <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
        Repeat
      </Button>
      <Button
        onClick={onGoBack}
        size="lg"
        className="rounded-2xl flex-1 min-h-[56px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft"
      >
        <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
        Go back
      </Button>
    </div>
  </div>
);

export default PanicCorner;
