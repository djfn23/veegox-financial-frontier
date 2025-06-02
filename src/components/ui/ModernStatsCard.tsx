
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ModernStatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  description?: string;
}

const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  description
}) => {
  return (
    <div className="veegox-card veegox-card-hover p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl veegox-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-medium ${
            isPositive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <span>{isPositive ? '+' : ''}{change}</span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-gray-500 text-sm">{description}</p>
      )}
    </div>
  );
};

export default ModernStatsCard;
