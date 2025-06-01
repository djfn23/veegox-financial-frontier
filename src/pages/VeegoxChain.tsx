
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import VeegoxChain from '@/components/blockchain/VeegoxChain';

const VeegoxChainPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="gradient-text">VeegoxChain</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              La blockchain native de l'écosystème Veegox avec infrastructure Alchemy
            </p>
          </div>

          {/* VeegoxChain Component */}
          <VeegoxChain />
        </div>
      </div>
    </div>
  );
};

export default VeegoxChainPage;
