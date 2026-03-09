import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CourseProvider } from "@/context/CourseContext";
import { Analytics } from "@vercel/analytics/react";
import Landing from "./pages/Landing";
import CourseMap from "./pages/CourseMap";
import LessonView from "./pages/LessonView";
import CourseComplete from "./pages/CourseComplete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CourseProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/course" element={<CourseMap />} />
            <Route path="/course/module/:id" element={<LessonView />} />
            <Route path="/course/complete" element={<CourseComplete />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </CourseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
