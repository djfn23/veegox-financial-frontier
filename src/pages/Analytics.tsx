
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import VeegoxAnalytics from '@/components/analytics/VeegoxAnalytics';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Veegox <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Analyse en temps réel de l'écosystème DeFi VeegoxChain
            </p>
          </div>

          <VeegoxAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
