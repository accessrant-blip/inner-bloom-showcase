import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Sparkles } from "lucide-react";

interface AIReflectionProps {
  userId: string;
}

export function AIReflection({ userId }: AIReflectionProps) {
  const [reflection, setReflection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReflection = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('generate-reflection', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      setReflection(data.reflection);
    } catch (error: any) {
      console.error('Error generating reflection:', error);
      toast({
        title: "Couldn't generate reflection",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl shadow-soft border-warm-brown/20 bg-gradient-to-br from-warm-brown/5 to-warm-peach/10 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warm-brown">
          <Sparkles className="h-5 w-5" />
          AI Reflection 🌙
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reflection ? (
          <div className="p-6 rounded-2xl bg-card backdrop-blur-sm border border-primary/20">
            <p className="text-foreground leading-relaxed">{reflection}</p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-muted/40 backdrop-blur-sm border border-border text-center">
            <p className="text-muted-foreground">
              Get a gentle AI-powered reflection on your emotional journey
            </p>
          </div>
        )}

        <Button
          onClick={generateReflection}
          disabled={loading}
          className="w-full rounded-xl gradient-hero hover:shadow-glow"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {reflection ? "Get New Reflection" : "Get My Reflection"}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Here's your daily reflection — take what resonates 💛
        </p>
      </CardContent>
    </Card>
  );
}