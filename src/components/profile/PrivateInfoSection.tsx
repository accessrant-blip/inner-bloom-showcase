import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Cigarette, Wine, Moon, Save } from "lucide-react";

interface PrivateInfoSectionProps {
  userId: string;
}

export function PrivateInfoSection({ userId }: PrivateInfoSectionProps) {
  const [privateInfo, setPrivateInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrivateInfo();
  }, [userId]);

  const fetchPrivateInfo = async () => {
    const { data, error } = await supabase
      .from('private_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setPrivateInfo(data);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('private_info')
        .upsert({
          user_id: userId,
          ...privateInfo
        });

      if (error) throw error;

      toast({
        title: "Saved securely! 🔒",
        description: "Your private information has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl shadow-soft border-warm-brown/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warm-brown">
          <Lock className="h-5 w-5" />
          Private Information
        </CardTitle>
        <CardDescription>
          Only you can see this information. Kept secure and confidential.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={privateInfo?.age || ""}
              onChange={(e) => setPrivateInfo({ ...privateInfo, age: parseInt(e.target.value) })}
              placeholder="Your age"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={privateInfo?.weight || ""}
              onChange={(e) => setPrivateInfo({ ...privateInfo, weight: parseFloat(e.target.value) })}
              placeholder="Your weight"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medications">Medications</Label>
          <Textarea
            id="medications"
            value={privateInfo?.medications || ""}
            onChange={(e) => setPrivateInfo({ ...privateInfo, medications: e.target.value })}
            placeholder="List any medications you're taking..."
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="routine">Daily Routine</Label>
          <Textarea
            id="routine"
            value={privateInfo?.daily_routine || ""}
            onChange={(e) => setPrivateInfo({ ...privateInfo, daily_routine: e.target.value })}
            placeholder="Describe your typical daily routine..."
            className="rounded-xl"
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-warm-brown">Habits</h4>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-warm-cream/30">
            <div className="flex items-center gap-3">
              <Cigarette className="h-5 w-5 text-warm-brown/60" />
              <span className="text-sm font-medium">Smoking 🚬</span>
            </div>
            <Switch
              checked={privateInfo?.smoking || false}
              onCheckedChange={(checked) => setPrivateInfo({ ...privateInfo, smoking: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-warm-cream/30">
            <div className="flex items-center gap-3">
              <Wine className="h-5 w-5 text-warm-brown/60" />
              <span className="text-sm font-medium">Drinking 🍷</span>
            </div>
            <Switch
              checked={privateInfo?.drinking || false}
              onCheckedChange={(checked) => setPrivateInfo({ ...privateInfo, drinking: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-warm-cream/30">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-warm-brown/60" />
              <span className="text-sm font-medium">Late Sleep 🌙</span>
            </div>
            <Switch
              checked={privateInfo?.late_sleep || false}
              onCheckedChange={(checked) => setPrivateInfo({ ...privateInfo, late_sleep: checked })}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-xl gradient-hero hover:shadow-glow"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Private Info"}
        </Button>
      </CardContent>
    </Card>
  );
}