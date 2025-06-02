
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import ModernStatsCard from '@/components/ui/ModernStatsCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap, Coins, Users, Globe, Lock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 veegox-animate-slide-up">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
                  🚀 Powered by VeegoxChain & Alchemy
                </div>
                <h1 className="veegox-heading-xl text-white">
                  The Future of
                  <br />
                  <span className="veegox-text-gradient">Decentralized Finance</span>
                </h1>
                <p className="veegox-text-lg text-gray-300 max-w-lg">
                  Experience next-generation DeFi with AI-powered investing, 
                  transparent lending, and community governance on VeegoxChain.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button className="veegox-button-primary text-lg">
                    Launch App
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button className="veegox-button-secondary text-lg">
                    Explore Ecosystem
                  </Button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">$250M+</p>
                  <p className="text-gray-400 text-sm">Total Value Locked</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">15K+</p>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">99.9%</p>
                  <p className="text-gray-400 text-sm">Uptime</p>
                </div>
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="relative">
              <div className="veegox-card p-8 veegox-animate-float">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Portfolio Overview</p>
                    <p className="text-white text-4xl font-bold">$12,430.75</p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'VEX Staking', amount: '$4,250.00', change: '+12.5%', color: 'purple' },
                    { name: 'AI Investment', amount: '$3,180.50', change: '+18.2%', color: 'blue' },
                    { name: 'Lending Pool', amount: '$2,500.25', change: '+8.7%', color: 'green' },
                    { name: 'Governance', amount: '$2,500.00', change: '+15.3%', color: 'cyan' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                        <span className="text-gray-300 font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{item.amount}</p>
                        <p className="text-green-400 text-sm">{item.change}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">24h Change</span>
                    <span className="text-green-400 font-semibold">+$1,247.32 (+11.2%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="veegox-heading-lg text-white mb-6">
              Complete DeFi Ecosystem
            </h2>
            <p className="veegox-text-lg text-gray-400 max-w-3xl mx-auto">
              Three native tokens powering a comprehensive suite of DeFi services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <ModernStatsCard
              title="AI-Powered Investing"
              value="25.3% APY"
              change="+3.2%"
              icon={TrendingUp}
              description="Automated portfolio management with advanced risk optimization"
            />
            <ModernStatsCard
              title="Secure Lending"
              value="$28.5M"
              change="+15.8%"
              icon={Shield}
              description="Transparent on-chain lending with dynamic interest rates"
            />
            <ModernStatsCard
              title="Active Governance"
              value="12,847"
              change="+8.4%"
              icon={Users}
              description="Community-driven decisions with gVEX token voting"
            />
          </div>

          {/* Token showcase */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                token: 'VEX',
                name: 'Utility Token',
                description: 'Primary token for fees, rewards, and platform access',
                color: 'purple',
                icon: Coins
              },
              {
                token: 'sVEX',
                name: 'Stable Token',
                description: 'Stable version for savings and low-risk investments',
                color: 'blue',
                icon: Lock
              },
              {
                token: 'gVEX',
                name: 'Governance Token',
                description: 'Voting power for protocol decisions and upgrades',
                color: 'green',
                icon: Globe
              }
            ].map((item, index) => (
              <div key={index} className="veegox-card veegox-card-hover p-8 text-center group">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-${item.color}-500/20 border border-${item.color}-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-10 h-10 text-${item.color}-400`} />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.token}</h3>
                    <p className={`text-${item.color}-400 font-semibold`}>{item.name}</p>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  <Button className="w-full veegox-button-secondary">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="veegox-card p-12 veegox-glow">
            <h2 className="veegox-heading-md text-white mb-6">
              Ready to Join the Future?
            </h2>
            <p className="veegox-text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Start earning with VeegoxChain's innovative DeFi products. 
              Connect your wallet and explore unlimited possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button className="veegox-button-primary text-lg">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/about">
                <Button className="veegox-button-secondary text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
