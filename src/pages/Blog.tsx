
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

const Blog = () => {
  const featuredPost = {
    title: "The Future of Decentralized Finance: Multi-Token Ecosystems",
    excerpt: "Exploring how platforms like Veegox are revolutionizing DeFi with specialized tokens for different use cases, creating more efficient and user-friendly financial systems.",
    author: "Veegox Team",
    date: "May 25, 2024",
    category: "DeFi Insights",
    readTime: "8 min read",
    image: "/api/placeholder/800/400"
  };

  const blogPosts = [
    {
      title: "Understanding VEX, sVEX, and gVEX: A Complete Guide",
      excerpt: "Deep dive into our three-token system and how each token serves a specific purpose in the Veegox ecosystem.",
      author: "Alex Chen",
      date: "May 22, 2024",
      category: "Education",
      readTime: "5 min read",
      icon: TrendingUp
    },
    {
      title: "Security First: How Veegox Protects Your Assets",
      excerpt: "Learn about our multi-layered security approach, including smart contract audits, insurance, and risk management.",
      author: "Sarah Kim",
      date: "May 20, 2024",
      category: "Security",
      readTime: "6 min read",
      icon: Shield
    },
    {
      title: "AI-Powered Investment Strategies: The Science Behind Smart Yields",
      excerpt: "Discover how our AI algorithms analyze market data to optimize portfolio performance and minimize risks.",
      author: "Dr. Michael Johnson",
      date: "May 18, 2024",
      category: "Technology",
      readTime: "7 min read",
      icon: Zap
    },
    {
      title: "Governance in Action: Community-Driven Protocol Development",
      excerpt: "See how gVEX holders are shaping the future of Veegox through decentralized governance and voting.",
      author: "Emma Rodriguez",
      date: "May 15, 2024",
      category: "Governance",
      readTime: "4 min read",
      icon: TrendingUp
    },
    {
      title: "DeFi Lending 2.0: Beyond Traditional Collateralization",
      excerpt: "Exploring innovative lending mechanisms including on-chain credit scoring and dynamic interest rates.",
      author: "James Wright",
      date: "May 12, 2024",
      category: "DeFi Insights",
      readTime: "6 min read",
      icon: Shield
    },
    {
      title: "Building for the Future: Veegox Roadmap 2024-2025",
      excerpt: "Get an exclusive look at upcoming features, partnerships, and expansion plans for the Veegox ecosystem.",
      author: "Veegox Team",
      date: "May 10, 2024",
      category: "Updates",
      readTime: "5 min read",
      icon: Zap
    }
  ];

  const categories = [
    { name: "All Posts", count: 25 },
    { name: "DeFi Insights", count: 8 },
    { name: "Education", count: 6 },
    { name: "Security", count: 4 },
    { name: "Technology", count: 5 },
    { name: "Governance", count: 2 }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DeFi Insights': return 'bg-purple-600';
      case 'Education': return 'bg-blue-600';
      case 'Security': return 'bg-green-600';
      case 'Technology': return 'bg-orange-600';
      case 'Governance': return 'bg-indigo-600';
      case 'Updates': return 'bg-pink-600';
      default: return 'bg-gray-600';
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
              Veegox <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay updated with the latest insights, tutorials, and developments 
              in the world of decentralized finance and the Veegox ecosystem.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="card-glassmorphism p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="bg-gray-700 text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="card-glassmorphism p-6">
                <h3 className="text-xl font-bold text-white mb-4">Newsletter</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Get the latest updates and insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Subscribe
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              <Card className="card-glassmorphism overflow-hidden mb-12">
                <div className="h-64 bg-gradient-to-r from-purple-600 to-blue-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(featuredPost.category)}`}>
                    Featured
                  </Badge>
                </div>
                <div className="p-8">
                  <Badge className={getCategoryColor(featuredPost.category)} variant="secondary">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mt-4 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {featuredPost.date}
                      </div>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="card-glassmorphism p-6 hover:glow-purple transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                      <post.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      Read Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
