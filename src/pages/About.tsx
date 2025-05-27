
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Zap, Shield } from 'lucide-react';

const About = () => {
  const teamMembers = [
    { name: "Alex Chen", role: "CEO & Co-Founder", image: "/placeholder.svg", bio: "Former Goldman Sachs VP, 10+ years in DeFi" },
    { name: "Sarah Kim", role: "CTO & Co-Founder", image: "/placeholder.svg", bio: "Ex-Google engineer, blockchain security expert" },
    { name: "Marcus Johnson", role: "Head of AI", image: "/placeholder.svg", bio: "MIT PhD, former quantitative researcher" },
    { name: "Elena Rodriguez", role: "Head of Product", image: "/placeholder.svg", bio: "UX expert, 8+ years in fintech" }
  ];

  const milestones = [
    { year: "2024 Q1", title: "Platform Launch", description: "Veegox mainnet goes live with core lending and staking features" },
    { year: "2024 Q2", title: "AI Integration", description: "Launch of AI-powered investment strategies and portfolio optimization" },
    { year: "2024 Q3", title: "DAO Governance", description: "Full DAO launch with gVEX governance token distribution" },
    { year: "2024 Q4", title: "Cross-Chain", description: "Multi-chain expansion to Polygon, Arbitrum, and Base" },
    { year: "2025 Q1", title: "Institutional", description: "Institutional products and advanced trading features" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Multi-layered security with regular audits and insurance coverage"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing the boundaries of DeFi with AI and cutting-edge technology"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building with and for our community through transparent governance"
    },
    {
      icon: Target,
      title: "Accessibility",
      description: "Making DeFi simple and accessible for everyone, regardless of experience"
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
              About <span className="gradient-text">Veegox</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're building the future of decentralized finance with AI-powered tools, 
              transparent governance, and community-first values.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To democratize access to sophisticated financial tools by combining the transparency 
                of blockchain technology with the power of artificial intelligence. We believe everyone 
                deserves access to the same financial opportunities regardless of their background or location.
              </p>
            </Card>

            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                A world where financial services are open, transparent, and accessible to all. 
                Where AI enhances human decision-making rather than replacing it, and where 
                communities have true ownership over the platforms they use.
              </p>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="card-glassmorphism p-6 text-center hover:glow-purple transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="card-glassmorphism p-6 text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-500"
                  />
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <Badge className="bg-purple-600 mb-3">{member.role}</Badge>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Roadmap</h2>
            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start mb-8 last:mb-0">
                  <div className="flex-shrink-0 w-24 text-right mr-8">
                    <Badge variant="secondary" className="bg-purple-600">
                      {milestone.year}
                    </Badge>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-purple-500 rounded-full mt-1 mr-8"></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <Card className="card-glassmorphism p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Veegox by the Numbers</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">$250M+</div>
                <div className="text-gray-400">Total Value Locked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">98.7%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
