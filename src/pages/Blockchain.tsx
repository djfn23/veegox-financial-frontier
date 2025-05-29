
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import WalletConnect from '@/components/wallet/WalletConnect';
import TokenBalances from '@/components/wallet/TokenBalances';
import TransactionHistory from '@/components/blockchain/TransactionHistory';
import { useWallet } from '@/hooks/useWallet';

const Blockchain = () => {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Veegox <span className="gradient-text">Blockchain</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Manage your VEX, sVEX, and gVEX tokens with real-time blockchain integration powered by Moralis
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8">
            <WalletConnect />
          </div>

          {/* Main Content */}
          {isConnected ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Token Balances */}
              <div className="lg:col-span-1">
                <TokenBalances />
              </div>

              {/* Transaction History */}
              <div className="lg:col-span-2">
                <TransactionHistory />
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Connect your wallet to view your Veegox tokens and transaction history
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blockchain;
