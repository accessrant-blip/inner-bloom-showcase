import { useState, useCallback, useRef, useEffect } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

// Type declarations for Web Speech API
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onspeechstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

// Check if the browser supports speech recognition
const getSpeechRecognitionAPI = (): (new () => SpeechRecognitionInstance) | null => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    continuous = false,
    interimResults = true,
    language = 'en-US',
  } = options;

  // Use refs for callbacks to avoid stale closures
  const onResultRef = useRef(options.onResult);
  const onErrorRef = useRef(options.onError);
  const onEndRef = useRef(options.onEnd);

  // Update refs when callbacks change
  useEffect(() => {
    onResultRef.current = options.onResult;
    onErrorRef.current = options.onError;
    onEndRef.current = options.onEnd;
  }, [options.onResult, options.onError, options.onEnd]);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported] = useState(() => !!getSpeechRecognitionAPI());
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isStartingRef = useRef(false);
  const shouldRestartRef = useRef(false);

  // Initialize recognition instance once
  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    
    if (!SpeechRecognitionAPI) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      isStartingRef.current = false;
      setIsListening(true);
    };

    recognition.onaudiostart = () => {
      console.log('Audio capture started');
    };

    recognition.onspeechstart = () => {
      console.log('Speech detected');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcriptText;
        } else {
          interim += transcriptText;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        onResultRef.current?.({ transcript: finalTranscript, isFinal: true });
      }
      
      setInterimTranscript(interim);
      if (interim) {
        onResultRef.current?.({ transcript: interim, isFinal: false });
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      isStartingRef.current = false;
      
      // Handle specific errors
      let errorMessage = 'Speech recognition error';
      let shouldStopListening = true;

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          // Don't stop for no-speech, user might still want to speak
          shouldStopListening = !continuous;
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found. Please check your device.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission was denied. Please allow access in your browser settings.';
          setHasPermission(false);
          break;
        case 'network':
          errorMessage = 'Network error occurred. Speech recognition requires an internet connection.';
          break;
        case 'aborted':
          // User aborted, don't show error
          shouldStopListening = true;
          return;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not allowed. Please use HTTPS.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      if (shouldStopListening) {
        setIsListening(false);
      }
      
      onErrorRef.current?.(errorMessage);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      isStartingRef.current = false;
      
      // If continuous mode and should still be listening, restart
      if (shouldRestartRef.current && continuous) {
        try {
          recognition.start();
          return;
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      }
      
      setIsListening(false);
      onEndRef.current?.();
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
    };
  }, [continuous, interimResults, language]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      onErrorRef.current?.('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    if (isStartingRef.current || isListening) {
      console.log('Already listening or starting');
      return;
    }

    isStartingRef.current = true;

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed to get permission
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      
      // Clear previous transcripts
      setTranscript('');
      setInterimTranscript('');
      shouldRestartRef.current = continuous;
      
      // Small delay to ensure previous session is fully stopped
      await new Promise(resolve => setTimeout(resolve, 100));
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Microphone access error:', error);
      isStartingRef.current = false;
      setHasPermission(false);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          onErrorRef.current?.('Microphone access was denied. Please allow microphone access in your browser settings and try again.');
        } else if (error.name === 'NotFoundError') {
          onErrorRef.current?.('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError') {
          onErrorRef.current?.('Microphone is in use by another application. Please close other apps using the microphone.');
        } else {
          onErrorRef.current?.(`Microphone error: ${error.message}`);
        }
      } else {
        onErrorRef.current?.('Failed to access microphone. Please check your browser settings.');
      }
    }
  }, [isListening, continuous]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    isStartingRef.current = false;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop errors
      }
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    hasPermission,
    startListening,
    stopListening,
    resetTranscript,
  };
}
