import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = true, className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className={`w-full justify-start rounded-xl hover:bg-muted ${className}`}
        disabled
      >
        <Sun className={`h-5 w-5 ${showLabel ? "mr-3" : ""}`} />
        {showLabel && <span>Theme</span>}
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className={`w-full justify-start rounded-xl hover:bg-muted transition-all ${className}`}
    >
      {isDark ? (
        <Sun className={`h-5 w-5 ${showLabel ? "mr-3" : ""}`} />
      ) : (
        <Moon className={`h-5 w-5 ${showLabel ? "mr-3" : ""}`} />
      )}
      {showLabel && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </Button>
  );
}
