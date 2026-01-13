import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SoulStream from "./pages/SoulStream";
import LearnAndGrow from "./pages/LearnAndGrow";
import BookHelp from "./pages/BookHelp";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EmergencySupport from "./pages/EmergencySupport";
import NotFound from "./pages/NotFound";
import WellnessToolkit from "./pages/WellnessToolkit";
import BreatheWithMe from "./pages/toolkit/BreatheWithMe";
import GroundYourself from "./pages/toolkit/GroundYourself";
import JournalSpace from "./pages/toolkit/JournalSpace";
import SelfCareReminder from "./pages/toolkit/SelfCareReminder";
import TrackMyHabit from "./pages/toolkit/TrackMyHabit";
import MiniGames from "./pages/toolkit/MiniGames";
import Kai from "./pages/Kai";
import InstantRelief from "./pages/InstantRelief";
import Connect from "./pages/Connect";
import Rant from "./pages/Rant";
import BookingConfirmed from "./pages/BookingConfirmed";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import ShotOfEspresso from "./pages/ShotOfEspresso";
import DayBuilder from "./pages/espresso/DayBuilder";
import MentalGym from "./pages/espresso/MentalGym";
import SocialTrainer from "./pages/espresso/SocialTrainer";
import InnerChild from "./pages/espresso/InnerChild";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
