import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { VIPProvider } from "@/contexts/VIPContext";
import { VIPUpsellModal } from "@/components/vip/VIPUpsellModal";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Calculadora from "./pages/Calculadora";
import Coach from "./pages/Coach";
import Desafios from "./pages/Desafios";
import Recetas from "./pages/Recetas";
import Progreso from "./pages/Progreso";
import GelatinaDia from "./pages/GelatinaDia";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <VIPProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <VIPUpsellModal />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calculadora" element={<Calculadora />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/desafios" element={<Desafios />} />
              <Route path="/recetas" element={<Recetas />} />
              <Route path="/progreso" element={<Progreso />} />
              <Route path="/gelatina" element={<GelatinaDia />} />
              <Route path="/perfil" element={<Perfil />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </VIPProvider>
  </QueryClientProvider>
);

export default App;