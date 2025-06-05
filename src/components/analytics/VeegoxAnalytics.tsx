
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Activity, Users, Zap, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  tvl: number;
  volume24h: number;
  transactions24h: number;
  activeUsers: number;
  aprAverage: number;
  tokenDistribution: { name: string; value: number; color: string }[];
  priceHistory: { date: string; vex: number; svex: number; gvex: number }[];
  volumeHistory: { date: string; volume: number }[];
}

const VeegoxAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      // Simuler le chargement des données analytiques
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        tvl: 12450000,
        volume24h: 2350000,
        transactions24h: 1247,
        activeUsers: 892,
        aprAverage: 15.8,
        tokenDistribution: [
          { name: 'VEX', value: 45, color: '#8B5CF6' },
          { name: 'sVEX', value: 35, color: '#3B82F6' },
          { name: 'gVEX', value: 20, color: '#10B981' },
        ],
        priceHistory: [
          { date: '01/01', vex: 2.00, svex: 2.10, gvex: 5.00 },
          { date: '02/01', vex: 2.05, svex: 2.15, gvex: 5.10 },
          { date: '03/01', vex: 2.10, svex: 2.20, gvex: 5.25 },
          { date: '04/01', vex: 2.08, svex: 2.18, gvex: 5.20 },
          { date: '05/01', vex: 2.15, svex: 2.25, gvex: 5.35 },
          { date: '06/01', vex: 2.20, svex: 2.30, gvex: 5.50 },
          { date: '07/01', vex: 2.25, svex: 2.35, gvex: 5.60 },
        ],
        volumeHistory: [
          { date: '01/01', volume: 1800000 },
          { date: '02/01', volume: 2100000 },
          { date: '03/01', volume: 1950000 },
          { date: '04/01', volume: 2350000 },
          { date: '05/01', volume: 2200000 },
          { date: '06/01', volume: 2450000 },
          { date: '07/01', volume: 2350000 },
        ]
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">TVL Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(analyticsData.tvl / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-green-400">+12.5% depuis hier</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Volume 24h</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(analyticsData.volume24h / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-blue-400">+8.2% depuis hier</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analyticsData.transactions24h.toLocaleString()}
            </div>
            <p className="text-xs text-purple-400">+15.1% depuis hier</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analyticsData.activeUsers}
            </div>
            <p className="text-xs text-orange-400">+22.8% depuis hier</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">APR Moyen</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analyticsData.aprAverage}%
            </div>
            <p className="text-xs text-yellow-400">Stable</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <Card className="bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Évolution des Prix (7j)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="vex" stroke="#8B5CF6" strokeWidth={2} name="VEX" />
                <Line type="monotone" dataKey="svex" stroke="#3B82F6" strokeWidth={2} name="sVEX" />
                <Line type="monotone" dataKey="gvex" stroke="#10B981" strokeWidth={2} name="gVEX" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volume Chart */}
        <Card className="bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Volume d'Échange (7j)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.volumeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="volume" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Token Distribution */}
      <Card className="bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Distribution des Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.tokenDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {analyticsData.tokenDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {analyticsData.tokenDistribution.map((token, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: token.color }}
                    />
                    <span className="text-white font-medium">{token.name}</span>
                  </div>
                  <Badge style={{ backgroundColor: token.color }}>
                    {token.value}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VeegoxAnalytics;
