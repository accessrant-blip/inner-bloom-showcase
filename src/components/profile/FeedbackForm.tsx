import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const FeedbackForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    responsiveness: "",
    recommend: "",
    suggestions: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('feedback_form')
        .insert({
          user_id: user?.id,
          name: formData.name,
          email: formData.email,
          responsiveness: formData.responsiveness,
          recommend: formData.recommend,
          suggestions: formData.suggestions
        });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback",
        description: "Your thoughts help us make Rant better.",
      });

      setFormData({
        name: "",
        email: "",
        responsiveness: "",
        recommend: "",
        suggestions: ""
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Contact RantFree</h2>
        <p className="text-muted-foreground">We'd love to hear from you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-border bg-input"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-border bg-input"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsiveness">How was the responsiveness of the app?</Label>
          <Select
            value={formData.responsiveness}
            onValueChange={(value) => setFormData({ ...formData, responsiveness: value })}
          >
            <SelectTrigger className="border-border bg-input">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Would you suggest this app to your friends?</Label>
          <RadioGroup
            value={formData.recommend}
            onValueChange={(value) => setFormData({ ...formData, recommend: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="font-normal cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="font-normal cursor-pointer">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maybe" id="maybe" />
              <Label htmlFor="maybe" className="font-normal cursor-pointer">Maybe</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="suggestions">Do you want to have or improve any new feature(s)?</Label>
          <Textarea
            id="suggestions"
            value={formData.suggestions}
            onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
            className="border-border bg-input min-h-[120px]"
            placeholder="Share your ideas with us..."
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-success hover:bg-success-hover text-white rounded-xl h-12 text-base font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Feedback"
          )}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        You can also reach us anytime at <span className="font-medium">accessrant@gmail.com</span>
      </p>
    </Card>
  );
};

export default FeedbackForm;