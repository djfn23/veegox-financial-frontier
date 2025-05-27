
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { TrendingUp, PiggyBank, Calculator, Target } from 'lucide-react';

const Savings = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('conservative');

  const savingsStrategies = [
    {
      id: 'conservative',
      name: "Conservative Savings",
      token: "sVEX",
      apy: "8.5%",
      risk: "Very Low",
      description: "Stable returns with USDC backing",
      minDeposit: "$100",
      features: ["USDC Backed", "Daily Compound", "Instant Withdrawal"]
    },
    {
      id: 'balanced',
      name: "Balanced Growth",
      token: "sVEX + VEX",
      apy: "12.8%",
      risk: "Low",
      description: "Mix of stable and growth assets",
      minDeposit: "$500",
      features: ["Auto Rebalancing", "Risk Management", "Quarterly Bonus"]
    },
    {
      id: 'aggressive',
      name: "High Yield Savings",
      token: "Multi-Asset",
      apy: "18.2%",
      risk: "Medium",
      description: "Higher returns with DeFi protocols",
      minDeposit: "$1,000",
      features: ["Yield Farming", "Auto Compound", "Premium Support"]
    }
  ];

  const userSavings = [
    { strategy: "Conservative", balance: "$5,420.50", earned: "$320.50", apy: "8.5%", duration: "6 months" },
    { strategy: "Balanced Growth", balance: "$12,850.30", earned: "$1,350.30", apy: "12.8%", duration: "1 year" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Smart <span className="gradient-text">Savings</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Grow your wealth with automated savings strategies powered by sVEX stable token
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <PortfolioCard title="Total Savings" value="$45.2M" change="12.3%" />
            <PortfolioCard title="Your Balance" value="$18,270" change="15.8%" />
            <PortfolioCard title="Interest Earned" value="$1,670" change="22.4%" />
            <PortfolioCard title="Average APY" value="11.2%" change="1.5%" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Savings Calculator */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calculator className="mr-3 text-blue-500" />
                Savings Calculator
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Deposit Amount</label>
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount in USD"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Savings Strategy</label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  >
                    {savingsStrategies.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name} - {strategy.apy} APY
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Projected Returns</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">1 Month:</span>
                      <span className="text-white">${depositAmount ? (parseFloat(depositAmount) * 0.01).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">6 Months:</span>
                      <span className="text-white">${depositAmount ? (parseFloat(depositAmount) * 0.06).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">1 Year:</span>
                      <span className="text-green-400">${depositAmount ? (parseFloat(depositAmount) * 0.12).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Saving
                </Button>
              </div>
            </Card>

            {/* Savings Strategies */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Savings Strategies</h2>
              
              <div className="space-y-4">
                {savingsStrategies.map((strategy) => (
                  <div key={strategy.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
                        <p className="text-gray-400 text-sm">{strategy.description}</p>
                      </div>
                      <Badge className="bg-blue-600">{strategy.apy} APY</Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className="text-white">{strategy.risk}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Token:</span>
                        <span className="text-white">{strategy.token}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Min Deposit:</span>
                        <span className="text-white">{strategy.minDeposit}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white text-sm font-semibold mb-2">Features:</h4>
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
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setSelectedStrategy(strategy.id)}
                    >
                      Choose Strategy
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Your Savings */}
          <Card className="card-glassmorphism p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <PiggyBank className="mr-3 text-green-500" />
              Your Savings Accounts
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-3">Strategy</th>
                    <th className="text-left text-gray-400 py-3">Balance</th>
                    <th className="text-left text-gray-400 py-3">Interest Earned</th>
                    <th className="text-left text-gray-400 py-3">APY</th>
                    <th className="text-left text-gray-400 py-3">Duration</th>
                    <th className="text-left text-gray-400 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userSavings.map((saving, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4 text-white">{saving.strategy}</td>
                      <td className="py-4 text-white">{saving.balance}</td>
                      <td className="py-4 text-green-400">+{saving.earned}</td>
                      <td className="py-4 text-white">{saving.apy}</td>
                      <td className="py-4 text-white">{saving.duration}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Deposit</Button>
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

export default Savings;
