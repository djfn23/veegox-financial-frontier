
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface PriceChartProps {
  data: Array<{ name: string; VEX: number; sVEX: number; gVEX: number }>;
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  const periods = ['24H', '7D', '1M', '3M', '6M', '1Y'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300">{entry.dataKey}</span>
              </div>
              <span className="text-white font-bold">${entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="card-glassmorphism p-6 mb-12 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Token Price Performance</h2>
          <p className="text-gray-400">Real-time price tracking across all Veegox tokens</p>
        </div>
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
          {periods.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-xs ${
                selectedPeriod === period 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex space-x-6 mb-6">
        {[
          { key: 'VEX', color: '#8B5CF6', name: 'VEX Token' },
          { key: 'sVEX', color: '#3B82F6', name: 'Stable VEX' },
          { key: 'gVEX', color: '#10B981', name: 'Governance VEX' }
        ].map((token) => (
          <div 
            key={token.key}
            className={`flex items-center space-x-2 cursor-pointer transition-all duration-300 ${
              hoveredToken && hoveredToken !== token.key ? 'opacity-50' : 'opacity-100'
            }`}
            onMouseEnter={() => setHoveredToken(token.key)}
            onMouseLeave={() => setHoveredToken(null)}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: token.color }}
            />
            <span className="text-sm text-gray-300 font-medium">{token.name}</span>
          </div>
        ))}
      </div>

      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVEX" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorsVEX" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorgVEX" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="VEX" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              fillOpacity={hoveredToken === 'VEX' || !hoveredToken ? 1 : 0.3}
              fill="url(#colorVEX)"
            />
            <Area 
              type="monotone" 
              dataKey="sVEX" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={hoveredToken === 'sVEX' || !hoveredToken ? 1 : 0.3}
              fill="url(#colorsVEX)"
            />
            <Area 
              type="monotone" 
              dataKey="gVEX" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={hoveredToken === 'gVEX' || !hoveredToken ? 1 : 0.3}
              fill="url(#colorgVEX)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PriceChart;
