import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/Layout";
import { AuthGuard } from "./components/AuthGuard";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import PPTs from "./pages/PPTs";
import PastPapers from "./pages/PastPapers";
import Tutorials from "./pages/Tutorials";
import Upload from "./pages/Upload";
import Classmates from "./pages/Classmates";
import MockTests from "./pages/MockTests";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import MyLibrary from "./pages/MyLibrary";
import Community from "./pages/Community";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider delayDuration={300}>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="notes" element={<Notes />} />
                  <Route path="ppts" element={<PPTs />} />
                  <Route path="past-papers" element={<PastPapers />} />
                  <Route path="tutorials" element={<Tutorials />} />
                  <Route path="upload" element={<AuthGuard requireAuth><Upload /></AuthGuard>} />
                  <Route path="classmates" element={<Classmates />} />
                  <Route path="mock-tests" element={<MockTests />} />
                  <Route path="login" element={<AuthGuard><Login /></AuthGuard>} />
                  <Route path="register" element={<AuthGuard><Register /></AuthGuard>} />
                  <Route path="dashboard" element={<AuthGuard requireAuth><Dashboard /></AuthGuard>} />
                  <Route path="library" element={<AuthGuard requireAuth><MyLibrary /></AuthGuard>} />
                  <Route path="community" element={<AuthGuard requireAuth><Community /></AuthGuard>} />
                  <Route path="notifications" element={<AuthGuard requireAuth><Notifications /></AuthGuard>} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
