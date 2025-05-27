
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, Users, ArrowRight } from 'lucide-react';

const Products = () => {
  const products = [
    {
      icon: Shield,
      title: "Decentralized Lending",
      description: "Borrow and lend assets with transparent on-chain scoring and automated liquidation protection.",
      features: ["Collateralized loans", "Dynamic interest rates", "On-chain credit scoring", "Instant liquidation"],
      apy: "8-12%",
      color: "blue",
      route: "/lending"
    },
    {
      icon: TrendingUp,
      title: "AI Investment Pools",
      description: "Automated portfolio management with risk-adjusted strategies powered by advanced algorithms.",
      features: ["AI-driven strategies", "Risk optimization", "Auto-rebalancing", "Performance tracking"],
      apy: "15-25%",
      color: "purple",
      route: "/investing"
    },
    {
      icon: Zap,
      title: "Staking & Rewards",
      description: "Stake your tokens to earn rewards while contributing to network security and governance.",
      features: ["Flexible staking", "Compound rewards", "Governance rights", "Early unstaking"],
      apy: "10-18%",
      color: "green",
      route: "/staking"
    },
    {
      icon: Users,
      title: "DAO Governance",
      description: "Participate in protocol decisions through gVEX tokens and shape the future of Veegox.",
      features: ["Proposal voting", "Treasury management", "Protocol upgrades", "Community rewards"],
      apy: "Governance",
      color: "orange",
      route: "/governance"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600 text-blue-100 border-blue-500';
      case 'purple': return 'bg-purple-600 text-purple-100 border-purple-500';
      case 'green': return 'bg-green-600 text-green-100 border-green-500';
      case 'orange': return 'bg-orange-600 text-orange-100 border-orange-500';
      default: return 'bg-gray-600 text-gray-100 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Veegox <span className="gradient-text">Products</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive DeFi solutions powered by three native tokens: VEX for utility, 
              sVEX for stability, and gVEX for governance.
            </p>
          </div>

          {/* Token Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="card-glassmorphism p-6 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">VEX</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">VEX Token</h3>
              <p className="text-gray-400 mb-4">Primary utility token for fees, rewards, and platform access</p>
              <Badge className="bg-purple-600">Utility Token</Badge>
            </Card>

            <Card className="card-glassmorphism p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">sVEX</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">sVEX Token</h3>
              <p className="text-gray-400 mb-4">Stable version for savings and low-risk investments</p>
              <Badge className="bg-blue-600">Stable Token</Badge>
            </Card>

            <Card className="card-glassmorphism p-6 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">gVEX</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">gVEX Token</h3>
              <p className="text-gray-400 mb-4">Governance token for voting and protocol decisions</p>
              <Badge className="bg-green-600">Governance Token</Badge>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="card-glassmorphism p-8 hover:glow-purple transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(product.color)}`}>
                    <product.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-gray-700">
                    {product.apy}
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{product.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Link to={product.route} className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Card className="card-glassmorphism p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your DeFi Journey?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of users already earning with Veegox's innovative DeFi products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                    Launch App
                  </Button>
                </Link>
                <Link to="/tokens">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-3">
                    View Tokens
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
