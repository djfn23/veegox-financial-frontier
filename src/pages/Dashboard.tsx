
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, DollarSign, Vote } from 'lucide-react';

const Dashboard = () => {
  const [connectedWallet, setConnectedWallet] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Manage your DeFi portfolio</p>
            </div>
            {!connectedWallet && (
              <Button 
                onClick={() => setConnectedWallet(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            {connectedWallet && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-600">Connected</Badge>
                <span className="text-sm text-gray-400">0x1234...5678</span>
              </div>
            )}
          </div>

          {connectedWallet ? (
            <>
              {/* Portfolio Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PortfolioCard 
                  title="Total Portfolio" 
                  value="$12,430.75" 
                  change="12.5%" 
                  isPositive={true}
                />
                <PortfolioCard 
                  title="Lending" 
                  value="$4,250.00" 
                  change="8.2%" 
                  isPositive={true}
                />
                <PortfolioCard 
                  title="Staking Rewards" 
                  value="$2,500.25" 
                  change="15.1%" 
                  isPositive={true}
                />
                <PortfolioCard 
                  title="AI Investments" 
                  value="$2,500.00" 
                  change="22.8%" 
                  isPositive={true}
                />
              </div>

              {/* Token Balances */}
              <Card className="card-glassmorphism p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-6">Token Balances</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">VEX</span>
                    </div>
                    <p className="text-white text-lg font-semibold">2,450 VEX</p>
                    <p className="text-gray-400 text-sm">≈ $4,900.00</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">sVEX</span>
                    </div>
                    <p className="text-white text-lg font-semibold">1,590 sVEX</p>
                    <p className="text-gray-400 text-sm">≈ $3,180.00</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">gVEX</span>
                    </div>
                    <p className="text-white text-lg font-semibold">500 gVEX</p>
                    <p className="text-gray-400 text-sm">≈ $2,500.00</p>
                  </div>
                </div>
              </Card>

              {/* Main Tabs */}
              <Tabs defaultValue="lending" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="lending">Lending</TabsTrigger>
                  <TabsTrigger value="savings">Savings</TabsTrigger>
                  <TabsTrigger value="staking">Staking</TabsTrigger>
                  <TabsTrigger value="governance">Governance</TabsTrigger>
                </TabsList>

                <TabsContent value="lending">
                  <Card className="card-glassmorphism p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Decentralized Lending</h3>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        New Loan
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Available to Borrow</h4>
                        <p className="text-2xl font-bold text-green-400">$8,500.00</p>
                        <p className="text-gray-400 text-sm">Based on your collateral</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Credit Score</h4>
                        <p className="text-2xl font-bold text-blue-400">850</p>
                        <p className="text-gray-400 text-sm">Excellent on-chain rating</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="savings">
                  <Card className="card-glassmorphism p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Savings Pools</h3>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Deposit sVEX
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">Stable Savings Pool</h4>
                          <p className="text-gray-400">8.5% APY</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">1,590 sVEX</p>
                          <p className="text-gray-400">$3,180.00</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="staking">
                  <Card className="card-glassmorphism p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Staking Pools</h3>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Stake gVEX
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">Governance Staking</h4>
                          <p className="text-gray-400">15.2% APY + Voting Rights</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">500 gVEX</p>
                          <p className="text-gray-400">Locked for 90 days</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="governance">
                  <Card className="card-glassmorphism p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">DAO Governance</h3>
                      <Badge className="bg-purple-600">500 gVEX Voting Power</Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">VIP-001: Increase Lending APY</h4>
                          <Badge variant="secondary" className="bg-green-600">Active</Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Proposal to increase base lending APY from 8% to 10%</p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Vote Yes</Button>
                          <Button size="sm" variant="outline">Vote No</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="card-glassmorphism p-12 text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Connect your Web3 wallet to access your DeFi dashboard and start earning with Veegox.
              </p>
              <Button 
                onClick={() => setConnectedWallet(true)}
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              >
                Connect Wallet
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
