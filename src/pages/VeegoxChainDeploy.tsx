
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import VeegoxChainDeploymentTrigger from '@/components/veegoxchain/VeegoxChainDeploymentTrigger';

const VeegoxChainDeployPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Déployer <span className="gradient-text">VeegoxChain</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Lancez votre blockchain personnalisée en quelques clics avec Alchemy
            </p>
          </div>

          {/* Deployment Trigger */}
          <VeegoxChainDeploymentTrigger />

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">⚡ Déploiement Rapide</h3>
              <p className="text-gray-400 text-sm">
                Configuration automatique avec Alchemy pour un déploiement en moins de 5 minutes
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">🔒 Sécurisé</h3>
              <p className="text-gray-400 text-sm">
                Consensus Proof of Stake avec validation automatique des transactions
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">🌐 Production Ready</h3>
              <p className="text-gray-400 text-sm">
                Réseau compatible EVM avec support complet des smart contracts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeegoxChainDeployPage;
