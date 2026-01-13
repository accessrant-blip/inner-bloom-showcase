import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface FeatureRevealCardProps {
  word: string;
  feature: {
    title: string;
    description: string;
    route: string;
  };
  onClose: () => void;
  onAuthRequired: () => void;
}

const FeatureRevealCard = ({ word, feature, onClose, onAuthRequired }: FeatureRevealCardProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleTryFeature = () => {
    if (isAuthenticated) {
      navigate(feature.route);
    } else {
      onAuthRequired();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Word badge */}
        <div className="flex justify-center mb-6">
          <div className="px-6 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold tracking-widest">
            {word}
          </div>
        </div>

        {/* Feature content */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {feature.title}
          </h3>
          <p className="text-muted-foreground">
            {feature.description}
          </p>
        </div>

        {/* Action buttons */}
        {isLoading ? (
          <div className="h-12 bg-muted/20 rounded-lg animate-pulse" />
        ) : isAuthenticated ? (
          <Button
            variant="wellness"
            size="lg"
            className="w-full"
            onClick={handleTryFeature}
          >
            Try this feature
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
              <Lock className="h-4 w-4" />
              <span>Join RantFree to unlock this tool</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="wellness"
                className="flex-1"
                onClick={() => {
                  onClose();
                  onAuthRequired();
                }}
              >
                Create account
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onClose();
                  onAuthRequired();
                }}
              >
                Log in
              </Button>
            </div>
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-3xl blur-xl opacity-50 -z-10" />
      </div>
    </div>
  );
};

export default FeatureRevealCard;
