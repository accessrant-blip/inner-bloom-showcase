import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";

/**
 * Hook to get animation class based on accessibility settings
 * Returns empty string if reduce motion is enabled
 */
export function useAnimationClass(animationClass: string): string {
  const { settings } = useAccessibility();
  return settings.reduceMotion ? '' : animationClass;
}

/**
 * Hook to conditionally apply animation props
 * Returns empty object if reduce motion is enabled
 */
export function useAnimationProps<T extends Record<string, unknown>>(props: T): T | Record<string, never> {
  const { settings } = useAccessibility();
  return settings.reduceMotion ? {} : props;
}

/**
 * Hook to get transition duration based on accessibility settings
 * Returns 0 if reduce motion is enabled
 */
export function useTransitionDuration(duration: number): number {
  const { settings } = useAccessibility();
  return settings.reduceMotion ? 0 : duration;
}
