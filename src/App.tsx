import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { CourseProvider } from "@/context/CourseContext";
import { Analytics } from "@vercel/analytics/react";
import HomePage from "./pages/HomePage";
import CourseSkills from "./pages/CourseSkills";
import LessonView from "./pages/LessonView";
import CourseComplete from "./pages/CourseComplete";
import Survey from "./pages/Survey";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function CanonicalTag() {
  const location = useLocation();

  useEffect(() => {
    const canonicalLink = document.getElementById('canonical-link') as HTMLLinkElement;
    if (canonicalLink) {
      const baseUrl = 'https://untutorial.in';
      const newCanonical = `${baseUrl}${location.pathname}`;
      canonicalLink.href = newCanonical;
    }
  }, [location]);

  return null;
}

function ModuleRedirect() {
  const { id } = useParams();
  return <Navigate to={`/course/skills/${id}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CourseProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CanonicalTag />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course" element={<Navigate to="/course/skills" replace />} />
            <Route path="/course/skills" element={<CourseSkills />} />
            <Route path="/course/skills/:id" element={<LessonView />} />
            <Route path="/course/module/:id" element={<ModuleRedirect />} />
            <Route path="/course/complete" element={<CourseComplete />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </CourseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
