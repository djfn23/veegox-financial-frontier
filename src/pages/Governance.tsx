
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vote, Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const Governance = () => {
  const [votingPower] = useState(500);
  const [hasVoted, setHasVoted] = useState<{[key: string]: boolean}>({});

  const activeProposals = [
    {
      id: 'VIP-001',
      title: 'Increase Base Lending APY to 10%',
      description: 'Proposal to increase the base lending APY from the current 8% to 10% to attract more liquidity providers and improve competitiveness.',
      author: '0x1234...5678',
      status: 'Active',
      timeLeft: '5 days',
      votesFor: 75,
      votesAgainst: 25,
      totalVotes: 12500,
      quorum: 10000,
      category: 'Protocol'
    },
    {
      id: 'VIP-002',
      title: 'Treasury Diversification Strategy',
      description: 'Allocate 20% of treasury funds to blue-chip DeFi protocols to reduce risk and generate additional yield for the DAO.',
      author: '0x5678...1234',
      status: 'Active',
      timeLeft: '12 days',
      votesFor: 60,
      votesAgainst: 40,
      totalVotes: 8750,
      quorum: 10000,
      category: 'Treasury'
    },
    {
      id: 'VIP-003',
      title: 'Add New Collateral Assets',
      description: 'Proposal to add MATIC and AVAX as accepted collateral assets for lending with appropriate risk parameters.',
      author: '0x9999...0000',
      status: 'Active',
      timeLeft: '8 days',
      votesFor: 85,
      votesAgainst: 15,
      totalVotes: 15200,
      quorum: 10000,
      category: 'Protocol'
    }
  ];

  const completedProposals = [
    {
      id: 'VIP-000',
      title: 'Launch Governance Token Distribution',
      description: 'Initial distribution of gVEX tokens to early supporters and community members.',
      status: 'Passed',
      votesFor: 95,
      votesAgainst: 5,
      totalVotes: 25000,
      category: 'Launch'
    }
  ];

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    setHasVoted(prev => ({ ...prev, [proposalId]: true }));
    console.log(`Voted ${vote} on proposal ${proposalId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-600';
      case 'Passed': return 'bg-blue-600';
      case 'Failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Protocol': return 'bg-purple-600';
      case 'Treasury': return 'bg-blue-600';
      case 'Launch': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              DAO <span className="gradient-text">Governance</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Shape the future of Veegox through decentralized governance. 
              Use your gVEX tokens to vote on proposals and protocol upgrades.
            </p>
          </div>

          {/* Governance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="card-glassmorphism p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{votingPower}</p>
              <p className="text-gray-400 text-sm">Your Voting Power</p>
            </Card>

            <Card className="card-glassmorphism p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">1,247</p>
              <p className="text-gray-400 text-sm">Active Voters</p>
            </Card>

            <Card className="card-glassmorphism p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">25M</p>
              <p className="text-gray-400 text-sm">Total gVEX Supply</p>
            </Card>

            <Card className="card-glassmorphism p-6 text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">12</p>
              <p className="text-gray-400 text-sm">Proposals Passed</p>
            </Card>
          </div>

          {/* Proposals */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="active">Active Proposals</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {activeProposals.map((proposal) => (
                <Card key={proposal.id} className="card-glassmorphism p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(proposal.category)}>
                        {proposal.category}
                      </Badge>
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{proposal.timeLeft} left</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Proposal {proposal.id}</p>
                      <p className="text-xs text-gray-500">by {proposal.author}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{proposal.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{proposal.description}</p>

                  {/* Voting Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">Voting Progress</span>
                      <span className="text-gray-400">{proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} votes</span>
                    </div>
                    <Progress value={(proposal.totalVotes / proposal.quorum) * 100} className="h-2 mb-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-600/20 border border-green-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-semibold">For</span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">{proposal.votesFor}%</p>
                      </div>
                      <div className="bg-red-600/20 border border-red-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 font-semibold">Against</span>
                          <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">{proposal.votesAgainst}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  <div className="flex space-x-4">
                    {!hasVoted[proposal.id] ? (
                      <>
                        <Button 
                          onClick={() => handleVote(proposal.id, 'for')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Vote For
                        </Button>
                        <Button 
                          onClick={() => handleVote(proposal.id, 'against')}
                          variant="outline" 
                          className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Vote Against
                        </Button>
                      </>
                    ) : (
                      <div className="flex-1 text-center py-2">
                        <Badge className="bg-purple-600">Voted</Badge>
                        <p className="text-sm text-gray-400 mt-1">Thank you for participating!</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {completedProposals.map((proposal) => (
                <Card key={proposal.id} className="card-glassmorphism p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(proposal.category)}>
                        {proposal.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">Proposal {proposal.id}</p>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{proposal.title}</h3>
                  <p className="text-gray-400 mb-6">{proposal.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-600/20 border border-green-600 rounded-lg p-4">
                      <span className="text-green-400 font-semibold">For: {proposal.votesFor}%</span>
                    </div>
                    <div className="bg-red-600/20 border border-red-600 rounded-lg p-4">
                      <span className="text-red-400 font-semibold">Against: {proposal.votesAgainst}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Create Proposal CTA */}
          <Card className="card-glassmorphism p-8 text-center mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Have an Idea?</h2>
            <p className="text-gray-400 mb-6">
              Create a proposal to improve the Veegox protocol. Requires 1,000 gVEX to submit.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Create Proposal
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Governance;
