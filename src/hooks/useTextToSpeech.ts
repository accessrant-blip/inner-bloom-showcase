import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const {
    rate = 1,
    pitch = 1,
    volume = 1,
    voice: preferredVoice = null,
    onEnd,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Select a natural-sounding English voice by default
        const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
        const naturalVoice = englishVoices.find(v => 
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('neural') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('alex')
        ) || englishVoices[0] || availableVoices[0];
        
        setCurrentVoice(preferredVoice || naturalVoice);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (supported) {
        speechSynthesis.cancel();
      }
    };
  }, [preferredVoice]);

  // Strip emojis and emoticons from text for cleaner TTS output
  const stripEmojis = useCallback((text: string): string => {
    // Remove emoji characters (Unicode ranges for emojis)
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
      .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
      .replace(/[\u{231A}-\u{231B}]/gu, '')   // Watch, Hourglass
      .replace(/[\u{23E9}-\u{23F3}]/gu, '')   // Media control symbols
      .replace(/[\u{23F8}-\u{23FA}]/gu, '')   // Media control symbols
      .replace(/[\u{25AA}-\u{25AB}]/gu, '')   // Squares
      .replace(/[\u{25B6}]/gu, '')            // Play button
      .replace(/[\u{25C0}]/gu, '')            // Reverse button
      .replace(/[\u{25FB}-\u{25FE}]/gu, '')   // Squares
      .replace(/[\u{2934}-\u{2935}]/gu, '')   // Arrows
      .replace(/[\u{2B05}-\u{2B07}]/gu, '')   // Arrows
      .replace(/[\u{2B1B}-\u{2B1C}]/gu, '')   // Squares
      .replace(/[\u{2B50}]/gu, '')            // Star
      .replace(/[\u{2B55}]/gu, '')            // Circle
      .replace(/[\u{3030}]/gu, '')            // Wavy dash
      .replace(/[\u{303D}]/gu, '')            // Part alternation mark
      .replace(/[\u{3297}]/gu, '')            // Circled Ideograph Congratulation
      .replace(/[\u{3299}]/gu, '')            // Circled Ideograph Secret
      .replace(/\s+/g, ' ')                   // Normalize whitespace
      .trim();
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      onError?.('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Strip emojis before speaking
    const cleanText = stripEmojis(text);
    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (currentVoice) {
      utterance.voice = currentVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      onError?.('An error occurred while speaking. Please try again.');
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, rate, pitch, volume, currentVoice, onEnd, onError]);

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (isSpeaking && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSpeaking, isPaused]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    currentVoice,
    setVoice,
  };
}
