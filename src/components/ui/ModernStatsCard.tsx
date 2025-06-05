
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
    <div className="veegox-card veegox-card-hover p-4 sm:p-6 group">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl veegox-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-400 text-xs sm:text-sm font-medium truncate">{title}</p>
            <p className="text-white text-xl sm:text-2xl font-bold truncate">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs sm:text-sm font-medium flex-shrink-0 ${
            isPositive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <span>{isPositive ? '+' : ''}{change}</span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default ModernStatsCard;
