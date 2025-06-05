
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-bg pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Decentralized Finance
                <br />
                <span className="gradient-text">for the Digital Era</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Explore lending, staking, and automated investing 
                powered by AI and governed by our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                    Get Started
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3">
                    Explore Veegox <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="relative">
              <Card className="card-glassmorphism p-6 animate-float">
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Your Portfolio</p>
                  <p className="text-white text-3xl font-bold">$12,430.75</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Lending</span>
                    <span className="text-white font-semibold">$4,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Savings</span>
                    <span className="text-white font-semibold">$3,180.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Staking</span>
                    <span className="text-white font-semibold">$2,500.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">AI Investing</span>
                    <span className="text-white font-semibold">$2,500.00</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              The Complete DeFi Ecosystem
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Multi-token platform with VEX, sVEX, and gVEX powering lending, savings, and governance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-glassmorphism p-8 text-center hover:glow-purple transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Investing</h3>
              <p className="text-gray-400">
                Automated portfolio management with risk-adjusted strategies powered by advanced algorithms.
              </p>
            </Card>

            <Card className="card-glassmorphism p-8 text-center hover:glow-purple transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Decentralized Lending</h3>
              <p className="text-gray-400">
                Borrow and lend with transparent on-chain scoring and automated liquidation protection.
              </p>
            </Card>

            <Card className="card-glassmorphism p-8 text-center hover:glow-purple transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community Governance</h3>
              <p className="text-gray-400">
                Participate in protocol decisions through gVEX tokens and shape the future of Veegox.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">$250M+</p>
              <p className="text-gray-400">Total Value Locked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">15,000+</p>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">99.9%</p>
              <p className="text-gray-400">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">12%</p>
              <p className="text-gray-400">Average APY</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
