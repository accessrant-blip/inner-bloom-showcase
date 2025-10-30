import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SoulStream from "./pages/SoulStream";
import LearnAndGrow from "./pages/LearnAndGrow";
import BookHelp from "./pages/BookHelp";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/emergency-support" element={<EmergencySupport />} />
          <Route path="/soul-stream" element={<SoulStream />} />
          <Route path="/learn-grow" element={<LearnAndGrow />} />
          <Route path="/book-help" element={<BookHelp />} />
          <Route path="/kai" element={<Kai />} />
          <Route path="/instant-relief" element={<InstantRelief />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/wellness-toolkit" element={<WellnessToolkit />} />
          <Route path="/wellness-toolkit/breathe" element={<BreatheWithMe />} />
          <Route path="/wellness-toolkit/ground" element={<GroundYourself />} />
          <Route path="/wellness-toolkit/journal" element={<JournalSpace />} />
          <Route path="/wellness-toolkit/reminder" element={<SelfCareReminder />} />
          <Route path="/wellness-toolkit/habit" element={<TrackMyHabit />} />
          <Route path="/wellness-toolkit/games" element={<MiniGames />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
