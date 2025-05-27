
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Tokens from "./pages/Tokens";
import Governance from "./pages/Governance";
import Blog from "./pages/Blog";
import Lending from "./pages/Lending";
import Staking from "./pages/Staking";
import Savings from "./pages/Savings";
import Investing from "./pages/Investing";
import About from "./pages/About";
import Help from "./pages/Help";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/lending" element={<Lending />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/investing" element={<Investing />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/security" element={<Security />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
