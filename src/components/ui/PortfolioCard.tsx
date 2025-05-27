
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface PortfolioCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  data?: Array<{ value: number }>;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  data = [] 
}) => {
  const mockData = data.length > 0 ? data : [
    { value: 4000 }, { value: 3000 }, { value: 5000 }, 
    { value: 4500 }, { value: 6000 }, { value: 5500 }, { value: 7000 }
  ];

  return (
    <Card className="card-glassmorphism p-6 hover:glow-purple transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className="w-20 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? "#10b981" : "#ef4444"} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioCard;
