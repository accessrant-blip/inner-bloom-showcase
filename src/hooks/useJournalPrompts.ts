import { useState, useCallback, useEffect, useMemo } from "react";

const openEndedPrompts = [
  "Right now, I feel...",
  "Something that's been on my mind lately is...",
  "I've been avoiding...",
  "Something that affected me today was...",
  "My body feels...",
  "I wish someone understood...",
  "If I could be really honest, I would say...",
  "I need more...",
  "A small thing that helped me today was...",
  "If I was kind to myself, I would say...",
  "The thing I keep coming back to is...",
  "What I really want to say is...",
  "I noticed today that...",
  "Something I haven't told anyone is...",
  "The hardest part of today was...",
  "I'm carrying...",
  "What I need right now is...",
  "I keep thinking about...",
  "Something shifted in me when...",
  "I'm learning that...",
];

const moodPrompts: Record<string, string[]> = {
  anxious: [
    "The worry that keeps circling is...",
    "My chest feels tight because...",
    "If I could let go of one thing, it would be...",
    "What would help me feel safer right now is...",
    "The uncertainty I'm sitting with is...",
  ],
  sad: [
    "The weight I'm carrying feels like...",
    "I miss...",
    "Something I lost that I haven't talked about is...",
    "Today felt heavy because...",
    "What I need but can't ask for is...",
  ],
  angry: [
    "What I'm not saying out loud is...",
    "The boundary I need to set is...",
    "I feel unheard about...",
    "Something that isn't fair is...",
    "I deserve better when it comes to...",
  ],
  tired: [
    "I'm running on empty because...",
    "The one thing I'd take off my plate is...",
    "I haven't rested because...",
    "What drains me the most is...",
    "If I gave myself permission, I would...",
  ],
  calm: [
    "Something I'm grateful for today is...",
    "A moment of peace I noticed was...",
    "I feel grounded when...",
    "Something that went well today was...",
    "I'm proud of myself for...",
  ],
  overwhelmed: [
    "Everything feels like too much because...",
    "The first thing I need to let go of is...",
    "I don't know how to handle...",
    "If I could pause one thing, it would be...",
    "What no one sees is...",
  ],
  numb: [
    "I can't feel much right now, and I think it's because...",
    "The last time I felt something strongly was...",
    "I'm disconnected from...",
    "What I'm protecting myself from is...",
    "Underneath the numbness, there might be...",
  ],
};

const lowEnergyPrompts = [
  "Today in one word:",
  "I feel:",
  "I need:",
  "One thing on my mind:",
  "Right now I'm:",
];

const STORAGE_KEY = "journal_last_prompts";
const LAST_DATE_KEY = "journal_prompts_date";

function getDayString(): string {
  return new Date().toISOString().split("T")[0];
}

function shuffleWithSeed(arr: string[], seed: number): string[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1) * 9301 + 49297) % 233280) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getLastUsedPrompts(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLastUsedPrompts(prompts: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    localStorage.setItem(LAST_DATE_KEY, getDayString());
  } catch {
    // localStorage unavailable
  }
}

export function useJournalPrompts(mood?: string) {
  const [dismissed, setDismissed] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Determine prompt pool based on mood
  const promptPool = useMemo(() => {
    const normalizedMood = mood?.toLowerCase().trim() || "";
    
    // Check if mood matches any mood-based prompts
    for (const [key, prompts] of Object.entries(moodPrompts)) {
      if (normalizedMood.includes(key)) {
        return prompts;
      }
    }

    // Low energy keywords
    const lowEnergyKeywords = ["tired", "exhausted", "drained", "low", "meh"];
    if (lowEnergyKeywords.some(k => normalizedMood.includes(k))) {
      return lowEnergyPrompts;
    }

    return openEndedPrompts;
  }, [mood]);

  // Select prompts avoiding last-used ones
  const prompts = useMemo(() => {
    const lastUsed = getLastUsedPrompts();
    const daySeed = getDayString().split("-").reduce((a, b) => a + parseInt(b), 0);
    const seed = daySeed + refreshCount;

    // Filter out last-used prompts if possible
    let available = promptPool.filter(p => !lastUsed.includes(p));
    if (available.length < 4) {
      available = promptPool;
    }

    const shuffled = shuffleWithSeed(available, seed);
    const selected = shuffled.slice(0, Math.min(4, shuffled.length));

    return selected;
  }, [promptPool, refreshCount]);

  const refresh = useCallback(() => {
    setRefreshCount(c => c + 1);
    setDismissed(false);
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const selectPrompt = useCallback((prompt: string) => {
    // Store as last-used to avoid repetition
    const lastUsed = getLastUsedPrompts();
    const updated = [prompt, ...lastUsed.filter(p => p !== prompt)].slice(0, 8);
    saveLastUsedPrompts(updated);
  }, []);

  return {
    prompts,
    dismissed,
    refresh,
    dismiss,
    selectPrompt,
  };
}
