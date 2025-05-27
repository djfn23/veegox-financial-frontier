
import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Book, MessageCircle, Mail, Search } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'lending', name: 'Lending' },
    { id: 'staking', name: 'Staking' },
    { id: 'savings', name: 'Savings' },
    { id: 'ai-investing', name: 'AI Investing' },
    { id: 'governance', name: 'Governance' },
    { id: 'security', name: 'Security' }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: "How do I connect my wallet to Veegox?",
      answer: "Click the 'Connect Wallet' button in the top right corner and select your preferred wallet (MetaMask, WalletConnect, etc.). Make sure you're on the correct network (Ethereum mainnet)."
    },
    {
      category: 'getting-started',
      question: "What are VEX, sVEX, and gVEX tokens?",
      answer: "VEX is our utility token for fees and staking. sVEX is our stable token pegged to USDC for savings. gVEX is our governance token that gives you voting rights in the DAO."
    },
    {
      category: 'lending',
      question: "What is the minimum collateral required for a loan?",
      answer: "The minimum varies by asset: 0.1 ETH for Ethereum, 1000 VEX for VEX tokens, or $500 equivalent for other supported assets."
    },
    {
      category: 'lending',
      question: "How is my credit score calculated on-chain?",
      answer: "Our on-chain scoring considers your wallet history, previous loan performance, collateral ratio, and transaction patterns. Higher scores get better rates."
    },
    {
      category: 'staking',
      question: "What's the difference between flexible and locked staking?",
      answer: "Flexible staking allows you to unstake anytime with lower APY (12.5%). Locked staking requires a commitment period but offers higher rewards (18.2% for 90 days)."
    },
    {
      category: 'staking',
      question: "When do I receive my staking rewards?",
      answer: "Flexible staking rewards are distributed daily. Locked staking rewards compound automatically and are claimable after the lock period ends."
    },
    {
      category: 'savings',
      question: "How is sVEX kept stable?",
      answer: "sVEX is backed by USDC reserves and algorithmic stabilization mechanisms. The peg is maintained through smart contract automated market operations."
    },
    {
      category: 'ai-investing',
      question: "How does the AI make investment decisions?",
      answer: "Our AI analyzes market data, on-chain metrics, sentiment analysis, and technical indicators. It's trained on historical data and continuously learns from market conditions."
    },
    {
      category: 'ai-investing',
      question: "Can I customize my AI investment strategy?",
      answer: "Yes, you can adjust risk tolerance, sector preferences, and allocation limits. The AI will optimize within your specified parameters."
    },
    {
      category: 'governance',
      question: "How do I participate in DAO governance?",
      answer: "Hold gVEX tokens to vote on proposals. Your voting power is proportional to your gVEX balance. Visit the Governance page to see active proposals."
    },
    {
      category: 'governance',
      question: "What can the DAO vote on?",
      answer: "Protocol parameters, treasury allocation, new feature development, partnership approvals, and emergency measures."
    },
    {
      category: 'security',
      question: "Is my funds safe on Veegox?",
      answer: "Yes, we use multi-signature wallets, regular security audits, insurance coverage, and time-locked upgrades. Your private keys always remain with you."
    },
    {
      category: 'security',
      question: "What happens if there's a smart contract bug?",
      answer: "We have insurance coverage and an emergency pause mechanism. Bug bounty programs incentivize security researchers to find vulnerabilities."
    }
  ];

  const guides = [
    { title: "Getting Started with DeFi", duration: "5 min read", category: "Beginner" },
    { title: "How to Stake VEX Tokens", duration: "3 min read", category: "Staking" },
    { title: "Understanding AI Investment Strategies", duration: "7 min read", category: "AI Investing" },
    { title: "DAO Governance Guide", duration: "4 min read", category: "Governance" },
    { title: "Security Best Practices", duration: "6 min read", category: "Security" }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (selectedCategory === 'all' || faq.category === selectedCategory) &&
    (searchQuery === '' || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Help <span className="gradient-text">Center</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Find answers to common questions and learn how to use Veegox effectively
            </p>
          </div>

          {/* Search and Contact */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <Card className="card-glassmorphism p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Search className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help articles..."
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? "bg-purple-600" : ""}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="card-glassmorphism p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MessageCircle className="mr-2 text-blue-500" />
                Need More Help?
              </h3>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Mail className="mr-2 w-4 h-4" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full border-gray-600">
                  Join Discord
                </Button>
                <Button variant="outline" className="w-full border-gray-600">
                  Telegram Community
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQs */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <HelpCircle className="mr-3 text-purple-500" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <Card key={index} className="card-glassmorphism p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    <Badge variant="secondary" className="mt-3 text-xs">
                      {categories.find(c => c.id === faq.category)?.name}
                    </Badge>
                  </Card>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <Card className="card-glassmorphism p-8 text-center">
                  <p className="text-gray-400">No results found. Try adjusting your search or category filter.</p>
                </Card>
              )}
            </div>

            {/* Guides and Resources */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Book className="mr-3 text-green-500" />
                Guides & Tutorials
              </h2>
              
              <div className="space-y-4">
                {guides.map((guide, index) => (
                  <Card key={index} className="card-glassmorphism p-4 hover:glow-purple transition-all duration-300 cursor-pointer">
                    <h3 className="text-white font-semibold mb-2">{guide.title}</h3>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">{guide.category}</Badge>
                      <span className="text-gray-400 text-sm">{guide.duration}</span>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="card-glassmorphism p-6 mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                    → Security & Audit Reports
                  </a>
                  <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                    → API Documentation
                  </a>
                  <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                    → Token Economics
                  </a>
                  <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                    → Governance Proposals
                  </a>
                  <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                    → Bug Bounty Program
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
