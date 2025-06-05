import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from "@/components/ui/tooltip"
import Dashboard from '@/pages/Dashboard';
import Blockchain from '@/pages/Blockchain';
import BlockchainNetworks from '@/pages/BlockchainNetworks';
import VeegoxChain from '@/pages/VeegoxChain';
import VeegoxChainAdmin from '@/pages/VeegoxChainAdmin';
import Analytics from '@/pages/Analytics';

import { AuthProvider } from '@/components/auth/AuthProvider';
import Auth from '@/pages/Auth';
import DEX from '@/pages/DEX';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blockchain" element={<Blockchain />} />
              <Route path="/networks" element={<BlockchainNetworks />} />
              <Route path="/veegoxchain" element={<VeegoxChain />} />
              <Route path="/veegoxchain-admin" element={<VeegoxChainAdmin />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dex" element={<DEX />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
