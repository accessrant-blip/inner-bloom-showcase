import { useCallback, useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition as useLibrarySpeechRecognition } from 'react-speech-recognition';

interface UseReliableSpeechRecognitionOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  onListeningChange?: (isListening: boolean) => void;
}

/**
 * A more reliable speech recognition hook using react-speech-recognition library
 * Provides better cross-browser support and polyfill capabilities
 */
export function useReliableSpeechRecognition(options: UseReliableSpeechRecognitionOptions = {}) {
  const { onTranscript, onError, onListeningChange } = options;
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const lastTranscriptRef = useRef('');
  
  // Use refs to avoid stale closures
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);
  const onListeningChangeRef = useRef(onListeningChange);
  
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onErrorRef.current = onError;
    onListeningChangeRef.current = onListeningChange;
  }, [onTranscript, onError, onListeningChange]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useLibrarySpeechRecognition();

  // Track listening state changes
  useEffect(() => {
    onListeningChangeRef.current?.(listening);
    if (!listening) {
      setIsInitializing(false);
    }
  }, [listening]);

  // Process transcript changes
  useEffect(() => {
    if (transcript && transcript !== lastTranscriptRef.current) {
      const newText = transcript.slice(lastTranscriptRef.current.length);
      if (newText.trim()) {
        onTranscriptRef.current?.(newText.trim());
      }
      lastTranscriptRef.current = transcript;
    }
  }, [transcript]);

  const startListening = useCallback(async () => {
    if (isInitializing || listening) return;
    
    setIsInitializing(true);
    
    // Check browser support
    if (!browserSupportsSpeechRecognition) {
      setIsInitializing(false);
      onErrorRef.current?.('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);

      // Reset transcript before starting
      resetTranscript();
      lastTranscriptRef.current = '';

      // Start listening
      await SpeechRecognition.startListening({
        continuous: false,
        language: 'en-US',
      });
    } catch (error) {
      setIsInitializing(false);
      setHasPermission(false);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          onErrorRef.current?.('Microphone access was denied. Please allow microphone access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          onErrorRef.current?.('No microphone found. Please connect a microphone.');
        } else {
          onErrorRef.current?.(`Microphone error: ${error.message}`);
        }
      } else {
        onErrorRef.current?.('Failed to access microphone.');
      }
    }
  }, [isInitializing, listening, browserSupportsSpeechRecognition, resetTranscript]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    setIsInitializing(false);
  }, []);

  const reset = useCallback(() => {
    resetTranscript();
    lastTranscriptRef.current = '';
  }, [resetTranscript]);

  return {
    isListening: listening,
    isInitializing,
    transcript,
    isSupported: browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    hasPermission,
    startListening,
    stopListening,
    resetTranscript: reset,
  };
}
