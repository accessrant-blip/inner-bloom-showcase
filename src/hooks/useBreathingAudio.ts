import { useCallback, useRef, useEffect } from "react";

export type AudioMode = "full" | "minimal" | "silent";

type Phase = "inhale" | "topup" | "exhale" | "rest";

const FULL_SCRIPTS: Record<Phase, string> = {
  inhale: "Inhale through your nose",
  topup: "A little more",
  exhale: "Long slow exhale",
  rest: "",
};

const MINIMAL_SCRIPTS: Record<Phase, string> = {
  inhale: "Inhale",
  topup: "More",
  exhale: "Exhale",
  rest: "",
};

export function useBreathingAudio(mode: AudioMode) {
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Select a calm-sounding voice on mount
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer a female en-US voice for calmer tone
      const preferred = voices.find(
        (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
      );
      voiceRef.current = preferred || voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
    };

    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
  }, []);

  const speak = useCallback(
    (phase: Phase) => {
      if (mode === "silent" || !("speechSynthesis" in window)) return;

      const scripts = mode === "full" ? FULL_SCRIPTS : MINIMAL_SCRIPTS;
      const text = scripts[phase];
      if (!text) return;

      // Cancel previous utterance for soft transition
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.75;
      utterance.pitch = 0.85;
      utterance.volume = 0.65;
      if (voiceRef.current) utterance.voice = voiceRef.current;

      utterance.onerror = (e) => {
        if (e.error !== "canceled") {
          console.warn("Speech error:", e.error);
        }
        currentUtterance.current = null;
      };
      utterance.onend = () => {
        currentUtterance.current = null;
      };

      currentUtterance.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [mode]
  );

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    currentUtterance.current = null;
  }, []);

  return { speak, stop };
}
