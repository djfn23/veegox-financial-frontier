
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { TrendingUp, Shield, AlertTriangle, Clock } from 'lucide-react';

const Lending = () => {
  const [collateralAmount, setCollateralAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  const loanProducts = [
    {
      name: "ETH Collateral Loan",
      ltv: "75%",
      apy: "6.5%",
      minAmount: "0.1 ETH",
      maxDuration: "365 days",
      risk: "Low"
    },
    {
      name: "VEX Collateral Loan", 
      ltv: "60%",
      apy: "8.2%",
      minAmount: "1000 VEX",
      maxDuration: "180 days",
      risk: "Medium"
    },
    {
      name: "Multi-Asset Loan",
      ltv: "80%",
      apy: "5.8%",
      minAmount: "$500",
      maxDuration: "730 days",
      risk: "Low"
    }
  ];

  const activeLoans = [
    { id: 1, collateral: "2.5 ETH", borrowed: "$3,000", apy: "6.5%", dueDate: "2024-08-15" },
    { id: 2, collateral: "5000 VEX", borrowed: "$1,200", apy: "8.2%", dueDate: "2024-07-30" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Decentralized <span className="gradient-text">Lending</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Borrow against your crypto assets with transparent on-chain scoring and competitive rates
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <PortfolioCard title="Total Borrowed" value="$12.5M" change="5.2%" />
            <PortfolioCard title="Available Liquidity" value="$48.2M" change="12.8%" />
            <PortfolioCard title="Average APY" value="7.2%" change="-0.3%" isPositive={false} />
            <PortfolioCard title="Active Loans" value="2,847" change="8.4%" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Loan Calculator */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="mr-3 text-blue-500" />
                Loan Calculator
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Collateral Amount</label>
                  <input
                    type="text"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Loan Amount (Max 75% LTV)</label>
                  <input
                    type="text"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Calculated automatically"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    readOnly
                  />
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Interest Rate:</span>
                    <span className="text-white">6.5% APY</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Liquidation Price:</span>
                    <span className="text-white">$1,850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Health Factor:</span>
                    <span className="text-green-400">2.45</span>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Create Loan
                </Button>
              </div>
            </Card>

            {/* Available Loan Products */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Available Loan Products</h2>
              
              <div className="space-y-4">
                {loanProducts.map((product, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                      <Badge variant={product.risk === 'Low' ? 'secondary' : 'destructive'}>
                        {product.risk} Risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">LTV:</span>
                        <span className="text-white ml-2">{product.ltv}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">APY:</span>
                        <span className="text-white ml-2">{product.apy}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Min Amount:</span>
                        <span className="text-white ml-2">{product.minAmount}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Max Duration:</span>
                        <span className="text-white ml-2">{product.maxDuration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Active Loans */}
          <Card className="card-glassmorphism p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Clock className="mr-3 text-green-500" />
              Your Active Loans
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-3">Collateral</th>
                    <th className="text-left text-gray-400 py-3">Borrowed</th>
                    <th className="text-left text-gray-400 py-3">APY</th>
                    <th className="text-left text-gray-400 py-3">Due Date</th>
                    <th className="text-left text-gray-400 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLoans.map((loan) => (
                    <tr key={loan.id} className="border-b border-gray-800">
                      <td className="py-4 text-white">{loan.collateral}</td>
                      <td className="py-4 text-white">{loan.borrowed}</td>
                      <td className="py-4 text-white">{loan.apy}</td>
                      <td className="py-4 text-white">{loan.dueDate}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Repay</Button>
                          <Button size="sm" variant="secondary">Extend</Button>
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

export default Lending;
