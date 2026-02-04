import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  voiceFirst: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const defaultSettings: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  reduceMotion: false,
  voiceFirst: false,
};

const STORAGE_KEY = 'rantfree-accessibility-settings';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Check system preference for reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' 
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Load from localStorage or use defaults
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultSettings, ...JSON.parse(stored) };
        } catch {
          // Invalid JSON, use defaults
        }
      }
    }
    
    return { ...defaultSettings, reduceMotion: prefersReducedMotion };
  });

  const [announcement, setAnnouncement] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<'polite' | 'assertive'>('polite');

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Large text
    root.classList.toggle('accessibility-large-text', settings.largeText);
    
    // High contrast
    root.classList.toggle('accessibility-high-contrast', settings.highContrast);
    
    // Reduce motion
    root.classList.toggle('accessibility-reduce-motion', settings.reduceMotion);
    
    // Voice first mode
    root.classList.toggle('accessibility-voice-first', settings.voiceFirst);
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't explicitly set a preference
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setSettings(prev => ({ ...prev, reduceMotion: e.matches }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSettings({ ...defaultSettings, reduceMotion: prefersReducedMotion });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Clear first to ensure announcement is made
    setAnnouncement('');
    setAnnouncementPriority(priority);
    
    requestAnimationFrame(() => {
      setAnnouncement(message);
    });

    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 5000);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings, announce }}>
      {children}
      
      {/* Live region for screen reader announcements */}
      <div
        role={announcementPriority === 'assertive' ? 'alert' : 'status'}
        aria-live={announcementPriority}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Hook to check if reduced motion is preferred
export function usePrefersReducedMotion() {
  const { settings } = useAccessibility();
  return settings.reduceMotion;
}
