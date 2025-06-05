
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Blockchain from "./pages/Blockchain";
import BlockchainNetworks from "./pages/BlockchainNetworks";
import VeegoxChainPage from "./pages/VeegoxChain";
import VeegoxChainAdmin from "./pages/VeegoxChainAdmin";
import Tokens from "./pages/Tokens";
import Staking from "./pages/Staking";
import Governance from "./pages/Governance";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import Investing from "./pages/Investing";
import Savings from "./pages/Savings";
import Lending from "./pages/Lending";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
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
          <Route path="/blockchain" element={<Blockchain />} />
          <Route path="/blockchain-networks" element={<BlockchainNetworks />} />
          <Route path="/veegoxchain" element={<VeegoxChainPage />} />
          <Route path="/veegoxchain/admin" element={<VeegoxChainAdmin />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/products" element={<Products />} />
          <Route path="/investing" element={<Investing />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/lending" element={<Lending />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<Help />} />
          <Route path="/security" element={<Security />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
