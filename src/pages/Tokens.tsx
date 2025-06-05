
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid2X2, List, Filter, Search } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import PriceChart from '@/components/tokens/PriceChart';
import TokenCard from '@/components/tokens/TokenCard';
import DistributionChart from '@/components/tokens/DistributionChart';

const Tokens = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

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
      status: 'hot' as const,
      description: 'Primary utility token for transaction fees, staking rewards, and platform access.',
      utilities: ['Transaction fees', 'Staking rewards', 'Platform access', 'Liquidity mining'],
      sparklineData: [
        { value: 20 }, { value: 22 }, { value: 25 }, { value: 23 }, { value: 28 }, { value: 26 }, { value: 30 }
      ]
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
      status: 'stable' as const,
      description: 'Stable token pegged to USDC for savings and low-risk DeFi strategies.',
      utilities: ['Savings pools', 'Stable yield farming', 'Risk-free lending', 'Payment medium'],
      sparklineData: [
        { value: 20 }, { value: 20.1 }, { value: 19.9 }, { value: 20.05 }, { value: 19.95 }, { value: 20 }, { value: 20.02 }
      ]
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
      status: 'new' as const,
      description: 'Governance token for voting on protocol decisions and treasury management.',
      utilities: ['Governance voting', 'Protocol upgrades', 'Treasury decisions', 'Revenue sharing'],
      sparklineData: [
        { value: 45 }, { value: 47 }, { value: 44 }, { value: 49 }, { value: 48 }, { value: 50 }, { value: 52 }
      ]
    }
  ];

  const totalMarketCap = tokens.reduce((sum, token) => 
    sum + parseFloat(token.marketCap.replace('$', '').replace('M', '')), 0
  );

  const totalVolume = tokens.reduce((sum, token) => 
    sum + parseFloat(token.volume.replace('$', '').replace('M', '')), 0
  );

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || token.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <Navigation />
      <AnimatedBackground />
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">${totalMarketCap.toFixed(0)}M</div>
                <div className="text-sm text-gray-400">Total Market Cap</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">${totalVolume.toFixed(1)}M</div>
                <div className="text-sm text-gray-400">24h Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-sm text-gray-400">Active Tokens</div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Veegox <span className="gradient-text">Tokens</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three-token ecosystem designed for utility, stability, and governance 
              in the decentralized finance space.
            </p>
          </div>

          {/* Price Chart */}
          <PriceChart data={priceData} />

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">All Tokens</option>
                  <option value="hot">Hot</option>
                  <option value="stable">Stable</option>
                  <option value="new">New</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-800/50 p-1 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Token Cards Grid */}
          <div className={`grid gap-6 mb-12 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredTokens.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>

          {/* Distribution Charts */}
          <DistributionChart />
        </div>
      </div>
    </div>
  );
};

export default Tokens;
