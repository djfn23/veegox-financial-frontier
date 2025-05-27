
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { TrendingUp, Lock, Gift, Users } from 'lucide-react';

const Staking = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('vex-flexible');

  const stakingPools = [
    {
      id: 'vex-flexible',
      name: "VEX Flexible Staking",
      token: "VEX",
      apy: "12.5%",
      lockPeriod: "None",
      minStake: "100 VEX",
      totalStaked: "2.5M VEX",
      rewards: "Daily",
      risk: "Low"
    },
    {
      id: 'vex-locked',
      name: "VEX Locked Staking",
      token: "VEX", 
      apy: "18.2%",
      lockPeriod: "90 days",
      minStake: "500 VEX",
      totalStaked: "8.2M VEX",
      rewards: "Compound",
      risk: "Medium"
    },
    {
      id: 'gvex-governance',
      name: "gVEX Governance Pool",
      token: "gVEX",
      apy: "25.0%",
      lockPeriod: "365 days",
      minStake: "100 gVEX",
      totalStaked: "1.8M gVEX",
      rewards: "Governance + Yield",
      risk: "High"
    }
  ];

  const userStakes = [
    { pool: "VEX Flexible", amount: "5,000 VEX", rewards: "125.8 VEX", apy: "12.5%", status: "Active" },
    { pool: "gVEX Governance", amount: "1,000 gVEX", rewards: "68.5 gVEX", apy: "25.0%", status: "Locked" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Staking <span className="gradient-text">& Rewards</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stake your tokens to earn rewards while contributing to network security and governance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <PortfolioCard title="Total Staked" value="$28.5M" change="15.2%" />
            <PortfolioCard title="Your Staked" value="$12,450" change="8.4%" />
            <PortfolioCard title="Pending Rewards" value="194.3 VEX" change="25.6%" />
            <PortfolioCard title="Average APY" value="18.6%" change="2.1%" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Staking Interface */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lock className="mr-3 text-purple-500" />
                Stake Tokens
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Select Staking Pool</label>
                  <select
                    value={selectedPool}
                    onChange={(e) => setSelectedPool(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  >
                    {stakingPools.map((pool) => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name} - {pool.apy} APY
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Amount to Stake</label>
                  <input
                    type="text"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                {selectedPool && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    {stakingPools.filter(p => p.id === selectedPool).map(pool => (
                      <div key={pool.id}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Expected APY:</span>
                          <span className="text-green-400">{pool.apy}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Lock Period:</span>
                          <span className="text-white">{pool.lockPeriod}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Rewards:</span>
                          <span className="text-white">{pool.rewards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min Stake:</span>
                          <span className="text-white">{pool.minStake}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Stake Tokens
                </Button>
              </div>
            </Card>

            {/* Staking Pools */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Available Pools</h2>
              
              <div className="space-y-4">
                {stakingPools.map((pool) => (
                  <div key={pool.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
                        <p className="text-gray-400 text-sm">{pool.token} Token</p>
                      </div>
                      <Badge className="bg-green-600">{pool.apy} APY</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-400">Lock Period:</span>
                        <span className="text-white ml-2">{pool.lockPeriod}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Min Stake:</span>
                        <span className="text-white ml-2">{pool.minStake}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Staked:</span>
                        <span className="text-white ml-2">{pool.totalStaked}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rewards:</span>
                        <span className="text-white ml-2">{pool.rewards}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => setSelectedPool(pool.id)}
                    >
                      Select Pool
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Your Stakes */}
          <Card className="card-glassmorphism p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Gift className="mr-3 text-green-500" />
              Your Stakes & Rewards
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-3">Pool</th>
                    <th className="text-left text-gray-400 py-3">Staked Amount</th>
                    <th className="text-left text-gray-400 py-3">Pending Rewards</th>
                    <th className="text-left text-gray-400 py-3">APY</th>
                    <th className="text-left text-gray-400 py-3">Status</th>
                    <th className="text-left text-gray-400 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userStakes.map((stake, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4 text-white">{stake.pool}</td>
                      <td className="py-4 text-white">{stake.amount}</td>
                      <td className="py-4 text-green-400">{stake.rewards}</td>
                      <td className="py-4 text-white">{stake.apy}</td>
                      <td className="py-4">
                        <Badge variant={stake.status === 'Active' ? 'secondary' : 'destructive'}>
                          {stake.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Claim</Button>
                          {stake.status === 'Active' && (
                            <Button size="sm" variant="secondary">Unstake</Button>
                          )}
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

export default Staking;
