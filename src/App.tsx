import React, { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AppLayout from "./components/layout/AppLayout";
import { Loader2 } from "lucide-react";

// Eagerly load the landing page for best LCP
import Index from "./pages/Index";

// Lazy load all other pages for code-splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SoulStream = lazy(() => import("./pages/SoulStream"));
const LearnAndGrow = lazy(() => import("./pages/LearnAndGrow"));
const BookHelp = lazy(() => import("./pages/BookHelp"));
const ProfessionalProfile = lazy(() => import("./pages/ProfessionalProfile"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const EmergencySupport = lazy(() => import("./pages/EmergencySupport"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WellnessToolkit = lazy(() => import("./pages/WellnessToolkit"));
const BreatheWithMe = lazy(() => import("./pages/toolkit/BreatheWithMe"));
const GroundYourself = lazy(() => import("./pages/toolkit/GroundYourself"));
const JournalSpace = lazy(() => import("./pages/toolkit/JournalSpace"));
const SelfCareReminder = lazy(() => import("./pages/toolkit/SelfCareReminder"));
const TrackMyHabit = lazy(() => import("./pages/toolkit/TrackMyHabit"));
const MiniGames = lazy(() => import("./pages/toolkit/MiniGames"));
const Kai = lazy(() => import("./pages/Kai"));
const InstantRelief = lazy(() => import("./pages/InstantRelief"));
const Connect = lazy(() => import("./pages/Connect"));
const Rant = lazy(() => import("./pages/Rant"));
const BookingConfirmed = lazy(() => import("./pages/BookingConfirmed"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostPage = lazy(() => import("./pages/BlogPost"));
const ShotOfEspresso = lazy(() => import("./pages/ShotOfEspresso"));
const DayBuilder = lazy(() => import("./pages/espresso/DayBuilder"));
const MentalGym = lazy(() => import("./pages/espresso/MentalGym"));
const SocialTrainer = lazy(() => import("./pages/espresso/SocialTrainer"));
const InnerChild = lazy(() => import("./pages/espresso/InnerChild"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/emergency-support" element={<EmergencySupport />} />
                <Route path="/booking-confirmed" element={<BookingConfirmed />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                
                {/* App routes with persistent layout */}
                <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
                <Route path="/soul-stream" element={<AppLayout><SoulStream /></AppLayout>} />
                <Route path="/learn-grow" element={<AppLayout><LearnAndGrow /></AppLayout>} />
                <Route path="/book-help" element={<AppLayout><BookHelp /></AppLayout>} />
                <Route path="/book-help/professional/:id" element={<AppLayout><ProfessionalProfile /></AppLayout>} />
                <Route path="/kai" element={<AppLayout><Kai /></AppLayout>} />
                <Route path="/instant-relief" element={<AppLayout><InstantRelief /></AppLayout>} />
                <Route path="/connect" element={<AppLayout><Connect /></AppLayout>} />
                <Route path="/rant" element={<AppLayout><Rant /></AppLayout>} />
                <Route path="/wellness-toolkit" element={<AppLayout><WellnessToolkit /></AppLayout>} />
                <Route path="/wellness-toolkit/breathe" element={<AppLayout><BreatheWithMe /></AppLayout>} />
                <Route path="/wellness-toolkit/ground" element={<AppLayout><GroundYourself /></AppLayout>} />
                <Route path="/wellness-toolkit/journal" element={<AppLayout><JournalSpace /></AppLayout>} />
                <Route path="/wellness-toolkit/reminder" element={<AppLayout><SelfCareReminder /></AppLayout>} />
                <Route path="/wellness-toolkit/habit" element={<AppLayout><TrackMyHabit /></AppLayout>} />
                <Route path="/wellness-toolkit/games" element={<AppLayout><MiniGames /></AppLayout>} />
                
                {/* Espresso tools */}
                <Route path="/espresso" element={<AppLayout><ShotOfEspresso /></AppLayout>} />
                <Route path="/espresso/day-builder" element={<AppLayout><DayBuilder /></AppLayout>} />
                <Route path="/espresso/mental-gym" element={<AppLayout><MentalGym /></AppLayout>} />
                <Route path="/espresso/social-trainer" element={<AppLayout><SocialTrainer /></AppLayout>} />
                <Route path="/espresso/inner-child" element={<AppLayout><InnerChild /></AppLayout>} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;