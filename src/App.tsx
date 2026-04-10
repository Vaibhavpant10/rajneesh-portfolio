import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import HeroEditor from "./pages/admin/HeroEditor";
import AboutEditor from "./pages/admin/AboutEditor";
import EducationEditor from "./pages/admin/EducationEditor";
import SkillsEditor from "./pages/admin/SkillsEditor";
import ProjectsEditor from "./pages/admin/ProjectsEditor";
import ContactEditor from "./pages/admin/ContactEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><Dashboard /></AdminLayout></AdminProtectedRoute>} />
            <Route path="/admin/hero" element={<AdminProtectedRoute><AdminLayout><HeroEditor /></AdminLayout></AdminProtectedRoute>} />
            <Route path="/admin/about" element={<AdminProtectedRoute><AdminLayout><AboutEditor /></AdminLayout></AdminProtectedRoute>} />
            <Route path="/admin/education" element={<AdminProtectedRoute><AdminLayout><EducationEditor /></AdminLayout></AdminProtectedRoute>} />
            <Route path="/admin/skills" element={<AdminProtectedRoute><AdminLayout><SkillsEditor /></AdminLayout></AdminProtectedRoute>} />
            <Route path="/admin/projects" element={<AdminProtectedRoute><AdminLayout><ProjectsEditor /></AdminLayout></AdminProtectedRoute>} />
            <Route path="/admin/contact" element={<AdminProtectedRoute><AdminLayout><ContactEditor /></AdminLayout></AdminProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
