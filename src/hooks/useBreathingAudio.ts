import { useCallback, useRef } from "react";

type Phase = "inhale1" | "inhale2" | "hold" | "exhale";

const phrasesMap: Record<Phase, string> = {
  inhale1: "Inhale through your nose",
  inhale2: "Inhale a little more",
  hold: "Gently hold",
  exhale: "Slow exhale through your mouth",
};

export function useBreathingAudio() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((phase: Phase) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrasesMap[phase]);
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    utterance.volume = 0.7;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
