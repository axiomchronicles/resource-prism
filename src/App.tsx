import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/Layout";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="notes" element={<Notes />} />
              <Route path="ppts" element={<PPTs />} />
              <Route path="past-papers" element={<PastPapers />} />
              <Route path="tutorials" element={<Tutorials />} />
              <Route path="upload" element={<Upload />} />
              <Route path="classmates" element={<Classmates />} />
              <Route path="mock-tests" element={<MockTests />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="library" element={<MyLibrary />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
