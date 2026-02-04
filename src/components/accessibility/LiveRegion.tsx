import { useEffect, useRef, useState } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

/**
 * A visually hidden live region for screen reader announcements
 * Use this component when you need to announce dynamic content changes
 * 
 * For global announcements, prefer using the `announce` function from useAccessibility()
 */
export function LiveRegion({ 
  message, 
  priority = 'polite',
  clearAfter = 5000 
}: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (message) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Clear first to ensure the announcement is made
      setAnnouncement('');
      
      // Set the new message after a brief delay
      requestAnimationFrame(() => {
        setAnnouncement(message);
      });

      // Clear the message after specified time
      if (clearAfter > 0) {
        timeoutRef.current = setTimeout(() => {
          setAnnouncement('');
        }, clearAfter);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  return (
    <div
      role={priority === 'assertive' ? 'alert' : 'status'}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

/**
 * Utility component to provide status text alongside visual indicators
 * Use this when color alone conveys meaning (e.g., online/offline status)
 */
export function StatusIndicator({ 
  status, 
  label,
  className = '' 
}: { 
  status: 'success' | 'warning' | 'error' | 'info';
  label: string;
  className?: string;
}) {
  return (
    <span 
      className={`status-indicator ${className}`}
      data-status={status}
    >
      <span className="sr-only">{status}: </span>
      {label}
    </span>
  );
}
