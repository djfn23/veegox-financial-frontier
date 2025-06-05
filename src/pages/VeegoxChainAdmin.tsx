
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import VeegoxChainDashboard from '@/components/veegoxchain/VeegoxChainDashboard';

const VeegoxChainAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VeegoxChainDashboard />
        </div>
      </div>
    </div>
  );
};

export default VeegoxChainAdmin;
