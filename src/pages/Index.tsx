
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
      <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 veegox-animate-slide-up text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium">
                  🚀 Powered by VeegoxChain & Alchemy
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-white">
                  The Future of
                  <br />
                  <span className="veegox-text-gradient">Decentralized Finance</span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-gray-300 max-w-2xl mx-auto lg:mx-0">
                  Experience next-generation DeFi with AI-powered investing, 
                  transparent lending, and community governance on VeegoxChain.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/dashboard">
                  <Button className="veegox-button-primary text-base sm:text-lg w-full sm:w-auto">
                    Launch App
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button className="veegox-button-secondary text-base sm:text-lg w-full sm:w-auto">
                    Explore Ecosystem
                  </Button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 max-w-md sm:max-w-none mx-auto lg:mx-0">
                <div className="text-center bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-bold text-white">$250M+</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Value Locked</p>
                </div>
                <div className="text-center bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-bold text-white">15K+</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Active Users</p>
                </div>
                <div className="text-center bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-bold text-white">99.9%</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Uptime</p>
                </div>
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="relative mt-8 lg:mt-0">
              <div className="veegox-card p-6 sm:p-8 veegox-animate-float">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Portfolio Overview</p>
                    <p className="text-white text-3xl sm:text-4xl font-bold">$12,430.75</p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: 'VEX Staking', amount: '$4,250.00', change: '+12.5%', color: 'purple' },
                    { name: 'AI Investment', amount: '$3,180.50', change: '+18.2%', color: 'blue' },
                    { name: 'Lending Pool', amount: '$2,500.25', change: '+8.7%', color: 'green' },
                    { name: 'Governance', amount: '$2,500.00', change: '+15.3%', color: 'cyan' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                        <span className="text-gray-300 font-medium text-sm sm:text-base truncate">{item.name}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-semibold text-sm sm:text-base">{item.amount}</p>
                        <p className="text-green-400 text-xs sm:text-sm">{item.change}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex justify-between text-xs sm:text-sm">
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
      <section className="py-16 sm:py-20 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6">
              Complete DeFi Ecosystem
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-gray-400 max-w-3xl mx-auto">
              Three native tokens powering a comprehensive suite of DeFi services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
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
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
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
              <div key={index} className="veegox-card veegox-card-hover p-6 sm:p-8 text-center group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-${item.color}-500/20 border border-${item.color}-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-8 h-8 sm:w-10 sm:h-10 text-${item.color}-400`} />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{item.token}</h3>
                    <p className={`text-${item.color}-400 font-semibold text-sm sm:text-base`}>{item.name}</p>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{item.description}</p>
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
      <section className="py-16 sm:py-20 lg:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="veegox-card p-8 sm:p-12 veegox-glow">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-4 sm:mb-6">
              Ready to Join the Future?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Start earning with VeegoxChain's innovative DeFi products. 
              Connect your wallet and explore unlimited possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button className="veegox-button-primary text-base sm:text-lg w-full sm:w-auto">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/about">
                <Button className="veegox-button-secondary text-base sm:text-lg w-full sm:w-auto">
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
