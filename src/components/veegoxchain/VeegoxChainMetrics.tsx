
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVeegoxChain } from '@/hooks/useVeegoxChain';
import { 
  Activity, 
  Cpu, 
  Clock, 
  Users, 
  Zap,
  TrendingUp,
  Server
} from 'lucide-react';

const VeegoxChainMetrics = () => {
  const { metrics, config } = useVeegoxChain();

  if (!config || !metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-400">Aucune métrique disponible</p>
        </CardContent>
      </Card>
    );
  }

  const metricsData = [
    {
      title: 'Block Height',
      value: metrics.blockHeight.toLocaleString(),
      icon: Cpu,
      color: 'text-blue-500'
    },
    {
      title: 'TPS',
      value: metrics.tps.toFixed(2),
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      title: 'Temps de Bloc',
      value: `${metrics.avgBlockTime.toFixed(1)}s`,
      icon: Clock,
      color: 'text-green-500'
    },
    {
      title: 'Validateurs Actifs',
      value: metrics.activeValidators.toString(),
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Total Transactions',
      value: metrics.totalTransactions.toLocaleString(),
      icon: TrendingUp,
      color: 'text-orange-500'
    },
    {
      title: 'Gas Price Moyen',
      value: `${metrics.gasPriceAvg.toFixed(4)} Gwei`,
      icon: Server,
      color: 'text-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricsData.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VeegoxChainMetrics;
