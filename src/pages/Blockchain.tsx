
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import WalletConnect from '@/components/wallet/WalletConnect';
import TokenBalances from '@/components/wallet/TokenBalances';
import TransactionHistory from '@/components/blockchain/TransactionHistory';
import TransactionLookup from '@/components/blockchain/TransactionLookup';
import { useWallet } from '@/hooks/useWallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
              Gérez vos tokens VEX, sVEX et gVEX avec l'intégration blockchain en temps réel Alchemy
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8">
            <WalletConnect />
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="lookup">Recherche TX</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
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
                    Connectez votre wallet pour voir vos tokens Veegox et l'historique des transactions
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions">
              {isConnected ? (
                <TransactionHistory />
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg">
                    Connectez votre wallet pour voir l'historique des transactions
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lookup">
              <TransactionLookup />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Blockchain;
