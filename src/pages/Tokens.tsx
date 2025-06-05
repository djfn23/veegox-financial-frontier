
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

const Tokens = () => {
  const priceData = [
    { name: 'Jan', VEX: 2.4, sVEX: 2.0, gVEX: 5.2 },
    { name: 'Feb', VEX: 2.2, sVEX: 2.0, gVEX: 4.8 },
    { name: 'Mar', VEX: 2.8, sVEX: 2.0, gVEX: 5.8 },
    { name: 'Apr', VEX: 3.2, sVEX: 2.0, gVEX: 6.2 },
    { name: 'May', VEX: 2.9, sVEX: 2.0, gVEX: 5.9 },
    { name: 'Jun', VEX: 3.5, sVEX: 2.0, gVEX: 6.8 },
  ];

  const tokens = [
    {
      symbol: 'VEX',
      name: 'Veegox Utility Token',
      price: '$2.45',
      change: '+12.5%',
      isPositive: true,
      marketCap: '$245M',
      volume: '$15.2M',
      supply: '100M',
      color: 'purple',
      description: 'Primary utility token for transaction fees, staking rewards, and platform access.',
      utilities: ['Transaction fees', 'Staking rewards', 'Platform access', 'Liquidity mining']
    },
    {
      symbol: 'sVEX',
      name: 'Stable Veegox Token',
      price: '$2.00',
      change: '+0.1%',
      isPositive: true,
      marketCap: '$100M',
      volume: '$8.5M',
      supply: '50M',
      color: 'blue',
      description: 'Stable token pegged to USDC for savings and low-risk DeFi strategies.',
      utilities: ['Savings pools', 'Stable yield farming', 'Risk-free lending', 'Payment medium']
    },
    {
      symbol: 'gVEX',
      name: 'Governance Veegox Token',
      price: '$5.12',
      change: '+8.7%',
      isPositive: true,
      marketCap: '$128M',
      volume: '$6.8M',
      supply: '25M',
      color: 'green',
      description: 'Governance token for voting on protocol decisions and treasury management.',
      utilities: ['Governance voting', 'Protocol upgrades', 'Treasury decisions', 'Revenue sharing']
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple': return { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400' };
      case 'blue': return { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-400' };
      case 'green': return { bg: 'bg-green-600', border: 'border-green-500', text: 'text-green-400' };
      default: return { bg: 'bg-gray-600', border: 'border-gray-500', text: 'text-gray-400' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Veegox <span className="gradient-text">Tokens</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three-token ecosystem designed for utility, stability, and governance 
              in the decentralized finance space.
            </p>
          </div>

          {/* Price Chart */}
          <Card className="card-glassmorphism p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Token Price Performance</h2>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">VEX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">sVEX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">gVEX</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Line type="monotone" dataKey="VEX" stroke="#8B5CF6" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="sVEX" stroke="#3B82F6" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="gVEX" stroke="#10B981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Token Details */}
          <div className="space-y-8">
            {tokens.map((token, index) => {
              const colors = getColorClasses(token.color);
              return (
                <Card key={index} className="card-glassmorphism p-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Token Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{token.symbol}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{token.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-3xl font-bold text-white">{token.price}</span>
                            <span className={`flex items-center ${token.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {token.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                              {token.change}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-400 mb-6 leading-relaxed">{token.description}</p>

                      <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3">Token Utilities:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {token.utilities.map((utility, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full mr-3`}></div>
                              <span className="text-gray-300">{utility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Token Stats */}
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Market Cap</span>
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-white text-xl font-bold">{token.marketCap}</span>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">24h Volume</span>
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-white text-xl font-bold">{token.volume}</span>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Total Supply</span>
                          <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-white text-xl font-bold">{token.supply}</span>
                      </div>

                      <div className="space-y-2">
                        <Button className={`w-full ${colors.bg} hover:opacity-90`}>
                          Buy {token.symbol}
                        </Button>
                        <Button variant="outline" className={`w-full ${colors.border} ${colors.text} hover:bg-gray-700`}>
                          Add to Wallet
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Token Distribution */}
          <Card className="card-glassmorphism p-8 mt-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Token Distribution</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">VEX Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Public Sale</span>
                    <span className="text-white">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ecosystem</span>
                    <span className="text-white">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team</span>
                    <span className="text-white">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reserve</span>
                    <span className="text-white">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">sVEX Backing</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">USDC Reserve</span>
                    <span className="text-white">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">VEX Collateral</span>
                    <span className="text-white">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Other Assets</span>
                    <span className="text-white">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">gVEX Allocation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">DAO Treasury</span>
                    <span className="text-white">50%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Staking Rewards</span>
                    <span className="text-white">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team & Advisors</span>
                    <span className="text-white">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tokens;
