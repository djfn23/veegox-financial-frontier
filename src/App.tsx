
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tokens from "./pages/Tokens";
import Governance from "./pages/Governance";
import Staking from "./pages/Staking";
import CrowdfundingPage from "./pages/Crowdfunding";
import VeegoxChainLauncherPage from "./pages/VeegoxChainLauncher";
import VeegoxChainDeployPage from "./pages/VeegoxChainDeploy";
import BlockchainNetworks from "./pages/BlockchainNetworks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/crowdfunding" element={<CrowdfundingPage />} />
          <Route path="/veegox-chain-launcher" element={<VeegoxChainLauncherPage />} />
          <Route path="/veegox-chain-deploy" element={<VeegoxChainDeployPage />} />
          <Route path="/blockchain-networks" element={<BlockchainNetworks />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
