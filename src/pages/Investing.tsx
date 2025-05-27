
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { TrendingUp, Bot, Target, BarChart } from 'lucide-react';

const Investing = () => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('conservative');

  const aiStrategies = [
    {
      id: 'conservative',
      name: "Conservative AI Portfolio",
      riskLevel: "Low",
      expectedReturn: "8-12%",
      allocation: { stablecoins: 60, eth: 25, defi: 15 },
      minInvestment: "$500",
      features: ["Capital Protection", "Stable Returns", "Low Volatility"],
      performance: "+9.2%"
    },
    {
      id: 'balanced',
      name: "Balanced Growth AI",
      riskLevel: "Medium",
      expectedReturn: "15-25%",
      allocation: { eth: 40, defi: 35, altcoins: 25 },
      minInvestment: "$1,000",
      features: ["Diversified", "Auto Rebalancing", "Risk Management"],
      performance: "+18.7%"
    },
    {
      id: 'aggressive',
      name: "High Alpha AI Strategy",
      riskLevel: "High",
      expectedReturn: "25-50%",
      allocation: { defi: 50, altcoins: 30, emerging: 20 },
      minInvestment: "$2,500",
      features: ["Alpha Generation", "Trend Following", "Momentum Trading"],
      performance: "+32.4%"
    }
  ];

  const userPortfolios = [
    { 
      strategy: "Balanced Growth AI", 
      value: "$25,420", 
      performance: "+18.7%", 
      allocation: "40% ETH, 35% DeFi, 25% Alt",
      status: "Active"
    },
    { 
      strategy: "Conservative AI", 
      value: "$8,850", 
      performance: "+9.2%", 
      allocation: "60% Stable, 25% ETH, 15% DeFi",
      status: "Active"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              AI <span className="gradient-text">Investment</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Let artificial intelligence optimize your crypto portfolio with advanced algorithms and real-time market analysis
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <PortfolioCard title="Total AUM" value="$128.5M" change="24.3%" />
            <PortfolioCard title="Your Portfolio" value="$34,270" change="18.7%" />
            <PortfolioCard title="AI Accuracy" value="87.3%" change="3.2%" />
            <PortfolioCard title="Avg Returns" value="22.1%" change="5.8%" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* AI Portfolio Builder */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Bot className="mr-3 text-purple-500" />
                AI Portfolio Builder
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Investment Amount</label>
                  <input
                    type="text"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount in USD"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">AI Strategy</label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  >
                    {aiStrategies.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name} - {strategy.expectedReturn}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStrategy && aiStrategies.filter(s => s.id === selectedStrategy).map(strategy => (
                  <div key={strategy.id} className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Portfolio Allocation</h3>
                    <div className="space-y-2">
                      {Object.entries(strategy.allocation).map(([asset, percentage]) => (
                        <div key={asset} className="flex justify-between items-center">
                          <span className="text-gray-400 capitalize">{asset}:</span>
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-white">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Return:</span>
                        <span className="text-green-400">{strategy.expectedReturn}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Create AI Portfolio
                </Button>
              </div>
            </Card>

            {/* AI Strategies */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6">AI Investment Strategies</h2>
              
              <div className="space-y-4">
                {aiStrategies.map((strategy) => (
                  <div key={strategy.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
                        <p className="text-gray-400 text-sm">Risk Level: {strategy.riskLevel}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-600 mb-1">{strategy.performance}</Badge>
                        <p className="text-gray-400 text-xs">Last 30d</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Expected Return:</span>
                        <span className="text-white">{strategy.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Min Investment:</span>
                        <span className="text-white">{strategy.minInvestment}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white text-sm font-semibold mb-2">AI Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {strategy.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => setSelectedStrategy(strategy.id)}
                    >
                      Select Strategy
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Your AI Portfolios */}
          <Card className="card-glassmorphism p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart className="mr-3 text-green-500" />
              Your AI Portfolios
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-3">Strategy</th>
                    <th className="text-left text-gray-400 py-3">Portfolio Value</th>
                    <th className="text-left text-gray-400 py-3">Performance</th>
                    <th className="text-left text-gray-400 py-3">Allocation</th>
                    <th className="text-left text-gray-400 py-3">Status</th>
                    <th className="text-left text-gray-400 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userPortfolios.map((portfolio, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4 text-white">{portfolio.strategy}</td>
                      <td className="py-4 text-white">{portfolio.value}</td>
                      <td className="py-4 text-green-400">{portfolio.performance}</td>
                      <td className="py-4 text-gray-300 text-sm">{portfolio.allocation}</td>
                      <td className="py-4">
                        <Badge variant="secondary">{portfolio.status}</Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Rebalance</Button>
                          <Button size="sm" variant="secondary">Withdraw</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Investing;
