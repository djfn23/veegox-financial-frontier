
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DistributionChart = () => {
  const [activeChart, setActiveChart] = useState<string | null>(null);

  const distributionData = {
    VEX: [
      { name: 'Public Sale', value: 40, color: '#8B5CF6' },
      { name: 'Ecosystem', value: 25, color: '#A855F7' },
      { name: 'Team', value: 15, color: '#C084FC' },
      { name: 'Reserve', value: 20, color: '#DDD6FE' }
    ],
    sVEX: [
      { name: 'USDC Reserve', value: 80, color: '#3B82F6' },
      { name: 'VEX Collateral', value: 15, color: '#60A5FA' },
      { name: 'Other Assets', value: 5, color: '#93C5FD' }
    ],
    gVEX: [
      { name: 'DAO Treasury', value: 50, color: '#10B981' },
      { name: 'Staking Rewards', value: 30, color: '#34D399' },
      { name: 'Team & Advisors', value: 20, color: '#6EE7B7' }
    ]
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg border border-purple-500/30 shadow-xl">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-purple-400 font-bold">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="card-glassmorphism p-8 mt-12">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Token Distribution</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(distributionData).map(([tokenName, data]) => (
          <div 
            key={tokenName}
            className={`text-center transition-all duration-300 ${
              activeChart && activeChart !== tokenName ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
            onMouseEnter={() => setActiveChart(tokenName)}
            onMouseLeave={() => setActiveChart(null)}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {tokenName} {tokenName === 'VEX' ? 'Distribution' : tokenName === 'sVEX' ? 'Backing' : 'Allocation'}
            </h3>
            
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{tokenName}</div>
                  <div className="text-sm text-gray-400">Token</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DistributionChart;
