import { useCallback, useRef, useEffect } from 'react';

type AriaLive = 'polite' | 'assertive' | 'off';

/**
 * Hook for announcing messages to screen readers using ARIA live regions
 */
export function useScreenReaderAnnounce() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcer element if it doesn't exist
    let announcer = document.getElementById('sr-announcer') as HTMLDivElement;
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.setAttribute('role', 'status');
      announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(announcer);
    }
    
    announcerRef.current = announcer;

    return () => {
      // Don't remove on unmount as other components might use it
    };
  }, []);

  const announce = useCallback((message: string, priority: AriaLive = 'polite') => {
    if (!announcerRef.current) return;

    // Update aria-live based on priority
    announcerRef.current.setAttribute('aria-live', priority);
    
    // Clear and set message to trigger announcement
    announcerRef.current.textContent = '';
    
    // Use requestAnimationFrame to ensure the clear is processed first
    requestAnimationFrame(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    });
  }, []);

  const announceNewMessage = useCallback((sender: string, message: string) => {
    announce(`New message from ${sender}: ${message}`, 'polite');
  }, [announce]);

  const announceSystemMessage = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  const announceAlert = useCallback((message: string) => {
    announce(message, 'assertive');
  }, [announce]);

  return {
    announce,
    announceNewMessage,
    announceSystemMessage,
    announceAlert,
  };
}
