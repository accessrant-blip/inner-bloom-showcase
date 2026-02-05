import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Optimized auth hook with instant session restoration and lazy profile loading
 * - Checks persisted session first (no network call)
 * - Skips login screen immediately if session exists
 * - Non-blocking profile/preference loading after auth
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let mounted = true;

    // Set up auth listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session,
        });
      }
    );

    // Then check existing session (uses cached data when available)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    ...authState,
    signOut,
  };
}

/**
 * Hook for protected routes - redirects to home if not authenticated
 * Uses optimistic check to avoid flash of content
 */
export function useRequireAuth(redirectTo = "/") {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Only redirect after initial load completes
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate, redirectTo]);

  return auth;
}

/**
 * Hook for public routes - redirects to dashboard if already authenticated
 * Enables instant skip of login screen
 */
export function useRedirectIfAuthenticated(redirectTo = "/dashboard") {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Immediately redirect if already authenticated
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate, redirectTo]);

  return auth;
}
