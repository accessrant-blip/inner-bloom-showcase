import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WritingPromptsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  onRefresh: () => void;
  onDismiss: () => void;
}

export default function WritingPrompts({
  prompts,
  onSelectPrompt,
  onRefresh,
  onDismiss,
}: WritingPromptsProps) {
  return (
    <div className="space-y-3" role="region" aria-label="Writing prompts">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground italic">
          You don't need the right words. Just start anywhere.
        </p>
        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground rounded-lg"
            aria-label="Show different prompts"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground rounded-lg"
            aria-label="Dismiss prompts"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Dismiss
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2" role="list" aria-label="Suggested writing prompts">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className="text-sm px-3.5 py-2 rounded-full border border-border bg-muted/40 text-foreground/80 hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-all duration-200 cursor-pointer text-left min-h-[36px] md:min-h-[32px]"
            role="listitem"
            aria-label={`Use prompt: ${prompt}`}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
