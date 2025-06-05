
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import VEXFaucet from '@/components/faucet/VEXFaucet';

const Faucet = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold veegox-text-gradient mb-4">
              VEX Token Faucet
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get free VEX tokens to start using the Veegox ecosystem. 
              Claim 10 VEX every 24 hours with your connected wallet.
            </p>
          </div>

          {/* Faucet Component */}
          <div className="max-w-2xl mx-auto">
            <VEXFaucet />
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="veegox-card p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Free Tokens</h3>
                <p className="text-gray-400 text-sm">
                  Get 10 VEX tokens completely free every 24 hours
                </p>
              </div>
              <div className="veegox-card p-6">
                <h3 className="text-lg font-semibold text-white mb-2">No Registration</h3>
                <p className="text-gray-400 text-sm">
                  Just connect your Web3 wallet and start claiming
                </p>
              </div>
              <div className="veegox-card p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Instant Transfer</h3>
                <p className="text-gray-400 text-sm">
                  Tokens are sent directly to your wallet address
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
