import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Accessibility, 
  Eye, 
  Type, 
  Sparkles, 
  Mic, 
  RotateCcw,
  Info
} from "lucide-react";
import { useAccessibility } from "./AccessibilityProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AccessibilitySettings() {
  const { settings, updateSetting, resetSettings, announce } = useAccessibility();

  const handleToggle = (key: keyof typeof settings, value: boolean, label: string) => {
    updateSetting(key, value);
    announce(`${label} ${value ? 'enabled' : 'disabled'}`, 'polite');
  };

  const handleReset = () => {
    resetSettings();
    announce('Accessibility settings reset to defaults', 'polite');
  };

  const settingsItems = [
    {
      key: 'largeText' as const,
      icon: Type,
      label: 'Increase Text Size',
      description: 'Makes all text larger and easier to read',
      value: settings.largeText,
    },
    {
      key: 'highContrast' as const,
      icon: Eye,
      label: 'High Contrast Mode',
      description: 'Increases contrast between text and background for better visibility',
      value: settings.highContrast,
    },
    {
      key: 'reduceMotion' as const,
      icon: Sparkles,
      label: 'Reduce Motion',
      description: 'Minimizes animations and transitions throughout the app',
      value: settings.reduceMotion,
    },
    {
      key: 'voiceFirst' as const,
      icon: Mic,
      label: 'Voice-First Mode',
      description: 'Shows voice input buttons more prominently where available',
      value: settings.voiceFirst,
    },
  ];

  return (
    <Card className="rounded-3xl shadow-soft border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Accessibility className="h-5 w-5 text-primary" aria-hidden="true" />
          Accessibility
        </CardTitle>
        <CardDescription>
          Customize your experience to suit your needs. These settings apply across the entire app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {settingsItems.map((item) => (
            <div 
              key={item.key}
              className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <Label 
                    htmlFor={`accessibility-${item.key}`}
                    className="text-base font-medium text-foreground cursor-pointer flex items-center gap-2"
                  >
                    {item.label}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`More info about ${item.label}`}
                        >
                          <Info className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 pr-4">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                id={`accessibility-${item.key}`}
                checked={item.value}
                onCheckedChange={(checked) => handleToggle(item.key, checked, item.label)}
                aria-describedby={`accessibility-${item.key}-description`}
                className="mt-1"
              />
            </div>
          ))}
        </div>

        {/* Reset button */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto rounded-xl"
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Reset to Defaults
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will restore all accessibility settings to their default values.
          </p>
        </div>

        {/* Helpful info */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <h4 className="text-sm font-medium text-foreground mb-2">
            💡 Did you know?
          </h4>
          <p className="text-sm text-muted-foreground">
            RantFree automatically detects your system's motion preferences. 
            If you have "Reduce motion" enabled in your device settings, we'll respect that by default.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
