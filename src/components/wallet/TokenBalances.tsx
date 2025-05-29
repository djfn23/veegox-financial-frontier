
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Shield, Vote } from 'lucide-react';
import { useTokenBalances } from '@/hooks/useTokenBalances';

const TokenBalances = () => {
  const { balances, isLoading, getTotalValue, vexBalance, svexBalance, gvexBalance } = useTokenBalances();

  if (isLoading) {
    return (
      <Card className="card-glassmorphism p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const tokens = [
    {
      symbol: 'VEX',
      name: 'Veegox Utility Token',
      balance: vexBalance,
      icon: Coins,
      color: 'bg-blue-600',
      description: 'Main utility token for the Veegox ecosystem'
    },
    {
      symbol: 'sVEX',
      name: 'Stable Veegox',
      balance: svexBalance,
      icon: Shield,
      color: 'bg-green-600',
      description: 'Stable token pegged to USDC'
    },
    {
      symbol: 'gVEX',
      name: 'Governance Veegox',
      balance: gvexBalance,
      icon: Vote,
      color: 'bg-purple-600',
      description: 'Governance token for DAO voting'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <Card className="card-glassmorphism p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
          <Badge className="bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Live
          </Badge>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-white mb-2">
            ${getTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-400">Total Portfolio Value</p>
        </div>
      </Card>

      {/* Individual Token Balances */}
      <div className="grid gap-4">
        {tokens.map((token) => (
          <Card key={token.symbol} className="card-glassmorphism p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${token.color} rounded-full flex items-center justify-center`}>
                  <token.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{token.symbol}</h3>
                  <p className="text-sm text-gray-400">{token.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{token.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {token.balance.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 6 
                  })}
                </p>
                <p className="text-sm text-gray-400">{token.symbol}</p>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                Send
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Receive
              </Button>
              {token.symbol === 'VEX' && (
                <Button variant="outline" size="sm" className="flex-1">
                  Stake
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokenBalances;
