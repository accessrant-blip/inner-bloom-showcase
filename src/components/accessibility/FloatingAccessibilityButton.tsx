import { useState, useEffect, useCallback } from "react";
import { Accessibility } from "lucide-react";
import { AccessibilitySettings } from "./AccessibilitySettings";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function FloatingAccessibilityButton() {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "F2") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <button
              aria-label="Open accessibility options"
              className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-primary-hover text-primary-foreground shadow-lg hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Accessibility className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
            </button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p>Accessibility Options <kbd className="ml-1 text-xs opacity-70">Ctrl+F2</kbd></p>
        </TooltipContent>
      </Tooltip>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0 border-border">
        <div className="p-4 pt-8">
          <AccessibilitySettings />
        </div>
      </SheetContent>
    </Sheet>
  );
}
