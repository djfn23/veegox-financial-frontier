
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { TrendingUp, DollarSign, Users, BarChart } from 'lucide-react';

const Analytics = () => {
  const protocolMetrics = [
    { name: "Total Value Locked", value: "$248.5M", change: "+12.3%", period: "30d" },
    { name: "Daily Volume", value: "$15.2M", change: "+8.7%", period: "24h" },
    { name: "Active Users", value: "52,847", change: "+15.4%", period: "30d" },
    { name: "Transactions", value: "1.2M", change: "+22.1%", period: "30d" }
  ];

  const tokenMetrics = [
    { token: "VEX", price: "$2.45", marketCap: "$125M", volume: "$8.2M", change: "+5.2%" },
    { token: "sVEX", price: "$1.00", marketCap: "$45M", volume: "$2.1M", change: "+0.1%" },
    { token: "gVEX", price: "$12.80", marketCap: "$32M", volume: "$1.5M", change: "+8.9%" }
  ];

  const topPools = [
    { name: "ETH Lending Pool", tvl: "$48.2M", apy: "6.5%", utilization: "78%" },
    { name: "VEX Staking Pool", tvl: "$32.8M", apy: "18.2%", utilization: "92%" },
    { name: "sVEX Savings Pool", tvl: "$28.5M", apy: "8.5%", utilization: "85%" },
    { name: "AI Portfolio Conservative", tvl: "$22.1M", apy: "12.1%", utilization: "71%" },
    { name: "gVEX Governance Pool", tvl: "$18.9M", apy: "25.0%", utilization: "96%" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Protocol <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time insights into the Veegox ecosystem performance and metrics
            </p>
          </div>

          {/* Protocol Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {protocolMetrics.map((metric, index) => (
              <PortfolioCard
                key={index}
                title={metric.name}
                value={metric.value}
                change={metric.change}
                isPositive={metric.change.startsWith('+')}
              />
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Token Performance */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <DollarSign className="mr-3 text-green-500" />
                Token Metrics
              </h2>
              
              <div className="space-y-4">
                {tokenMetrics.map((token, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{token.token}</h3>
                        <p className="text-2xl font-bold text-white">{token.price}</p>
                      </div>
                      <div className={`text-right ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        <p className="font-semibold">{token.change}</p>
                        <p className="text-gray-400 text-sm">24h</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-white ml-2">{token.marketCap}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Volume 24h:</span>
                        <span className="text-white ml-2">{token.volume}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* TVL by Category */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BarChart className="mr-3 text-blue-500" />
                TVL Distribution
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Lending</span>
                    <span className="text-white">$98.5M (39.6%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: '39.6%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Staking</span>
                    <span className="text-white">$75.2M (30.3%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '30.3%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Savings</span>
                    <span className="text-white">$45.8M (18.4%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '18.4%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">AI Investing</span>
                    <span className="text-white">$29.0M (11.7%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: '11.7%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Pools */}
          <Card className="card-glassmorphism p-8 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="mr-3 text-purple-500" />
              Top Performing Pools
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-3">Pool Name</th>
                    <th className="text-left text-gray-400 py-3">TVL</th>
                    <th className="text-left text-gray-400 py-3">APY</th>
                    <th className="text-left text-gray-400 py-3">Utilization</th>
                    <th className="text-left text-gray-400 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topPools.map((pool, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4 text-white font-medium">{pool.name}</td>
                      <td className="py-4 text-white">{pool.tvl}</td>
                      <td className="py-4 text-green-400">{pool.apy}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: pool.utilization }}
                            ></div>
                          </div>
                          <span className="text-white text-sm">{pool.utilization}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
              <div className="space-y-3">
                {[
                  { type: "Deposit", amount: "5.2 ETH", pool: "ETH Lending", time: "2 min ago" },
                  { type: "Stake", amount: "10,000 VEX", pool: "VEX Staking", time: "5 min ago" },
                  { type: "Claim", amount: "125.8 VEX", pool: "Rewards", time: "8 min ago" },
                  { type: "Borrow", amount: "$15,000", pool: "ETH Lending", time: "12 min ago" },
                  { type: "Invest", amount: "$5,000", pool: "AI Conservative", time: "15 min ago" }
                ].map((tx, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                    <div>
                      <p className="text-white font-medium">{tx.type}</p>
                      <p className="text-gray-400 text-sm">{tx.pool}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{tx.amount}</p>
                      <p className="text-gray-400 text-sm">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Users className="mr-3 text-blue-500" />
                User Activity
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Daily Active Users</span>
                    <span className="text-white">8,247 (+12.5%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">New Users (30d)</span>
                    <span className="text-white">2,156 (+25.8%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Returning Users</span>
                    <span className="text-white">6,091 (+8.3%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
