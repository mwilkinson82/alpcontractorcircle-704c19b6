import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";
import Circle from "./pages/Circle.tsx";
import LeadMagnet from "./pages/LeadMagnet.tsx";
import ContractorCircle from "./pages/ContractorCircle.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ContractorCircle />} />
          <Route path="/index" element={<ContractorCircle />} />
          <Route path="/circle" element={<Circle />} />
          <Route path="/estimating" element={<LeadMagnet magnet="estimating" />} />
          <Route path="/q2" element={<LeadMagnet magnet="q2" />} />
          <Route path="/silos" element={<LeadMagnet magnet="silos" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
