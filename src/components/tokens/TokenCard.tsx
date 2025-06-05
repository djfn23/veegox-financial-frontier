
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Star } from 'lucide-react';

interface TokenCardProps {
  token: {
    symbol: string;
    name: string;
    price: string;
    change: string;
    isPositive: boolean;
    marketCap: string;
    volume: string;
    supply: string;
    color: string;
    description: string;
    utilities: string[];
    status?: 'hot' | 'stable' | 'new';
    sparklineData?: Array<{ value: number }>;
  };
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple': return { 
        bg: 'bg-purple-600', 
        border: 'border-purple-500', 
        text: 'text-purple-400',
        glow: 'shadow-purple-500/20'
      };
      case 'blue': return { 
        bg: 'bg-blue-600', 
        border: 'border-blue-500', 
        text: 'text-blue-400',
        glow: 'shadow-blue-500/20'
      };
      case 'green': return { 
        bg: 'bg-green-600', 
        border: 'border-green-500', 
        text: 'text-green-400',
        glow: 'shadow-green-500/20'
      };
      default: return { 
        bg: 'bg-gray-600', 
        border: 'border-gray-500', 
        text: 'text-gray-400',
        glow: 'shadow-gray-500/20'
      };
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'hot':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">🔥 Hot</Badge>;
      case 'stable':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">🛡️ Stable</Badge>;
      case 'new':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✨ New</Badge>;
      default:
        return null;
    }
  };

  const colors = getColorClasses(token.color);
  const sparklineData = token.sparklineData || [
    { value: 20 }, { value: 25 }, { value: 22 }, { value: 28 }, { value: 26 }, { value: 30 }, { value: 32 }
  ];

  return (
    <Card 
      className={`card-glassmorphism p-6 transition-all duration-500 cursor-pointer ${
        isHovered ? `glow-purple transform scale-105 ${colors.glow} shadow-2xl` : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with token info and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center transition-transform duration-300 ${
            isHovered ? 'scale-110 rotate-3' : ''
          }`}>
            <span className="text-white font-bold text-sm">{token.symbol}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{token.symbol}</h3>
            <p className="text-xs text-gray-400">{token.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          {getStatusBadge(token.status)}
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <Star className={`w-4 h-4 ${isHovered ? 'text-yellow-400' : 'text-gray-400'}`} />
          </Button>
        </div>
      </div>

      {/* Price and change */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-white">{token.price}</span>
          <div className={`flex items-center mt-1 ${token.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {token.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span className="text-sm font-medium">{token.change}</span>
          </div>
        </div>
        
        {/* Sparkline chart */}
        <div className="w-20 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={token.isPositive ? "#10b981" : "#ef4444"} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <DollarSign className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <div className="text-xs text-gray-400">Market Cap</div>
          <div className="text-sm font-bold text-white">{token.marketCap}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <TrendingUp className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <div className="text-xs text-gray-400">Volume</div>
          <div className="text-sm font-bold text-white">{token.volume}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <div className="text-xs text-gray-400">Supply</div>
          <div className="text-sm font-bold text-white">{token.supply}</div>
        </div>
      </div>

      {/* Utilities */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Key Utilities</h4>
        <div className="flex flex-wrap gap-1">
          {token.utilities.slice(0, 3).map((utility, idx) => (
            <Badge key={idx} variant="outline" className="text-xs px-2 py-1 border-gray-600 text-gray-300">
              {utility}
            </Badge>
          ))}
          {token.utilities.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-1 border-gray-600 text-gray-300">
              +{token.utilities.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <Button className={`flex-1 ${colors.bg} hover:opacity-90 transition-all duration-300 ${
          isHovered ? 'scale-105' : ''
        }`}>
          Buy {token.symbol}
        </Button>
        <Button variant="outline" className={`flex-1 ${colors.border} ${colors.text} hover:bg-gray-700 transition-all duration-300`}>
          Details
        </Button>
      </div>
    </Card>
  );
};

export default TokenCard;
