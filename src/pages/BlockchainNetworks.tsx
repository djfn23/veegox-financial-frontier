
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import NetworkManager from '@/components/blockchain/NetworkManager';

const BlockchainNetworks = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Réseaux <span className="gradient-text">Blockchain</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Gérez vos déploiements Veegox sur plusieurs réseaux avec les nœuds Alchemy
            </p>
          </div>

          {/* Network Manager */}
          <NetworkManager />
        </div>
      </div>
    </div>
  );
};

export default BlockchainNetworks;
