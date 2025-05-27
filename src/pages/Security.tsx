
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

const Security = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Multi-Signature Wallets",
      description: "All protocol funds are secured with multi-signature wallets requiring multiple confirmations for any transaction.",
      status: "Active"
    },
    {
      icon: Lock,
      title: "Time-Locked Upgrades",
      description: "Smart contract upgrades have a 48-hour time delay, giving users time to review changes before implementation.",
      status: "Active"
    },
    {
      icon: Eye,
      title: "Open Source Code",
      description: "All smart contracts are publicly verifiable on GitHub and Etherscan for complete transparency.",
      status: "Active"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Pause",
      description: "Circuit breaker mechanism that can halt operations in case of detected anomalies or security threats.",
      status: "Active"
    }
  ];

  const auditReports = [
    {
      auditor: "CertiK",
      date: "March 2024",
      scope: "Core Protocol",
      score: "96/100",
      status: "Passed",
      findings: { critical: 0, high: 0, medium: 2, low: 5 }
    },
    {
      auditor: "Quantstamp",
      date: "February 2024",
      scope: "AI Investment Module",
      score: "94/100",
      status: "Passed",
      findings: { critical: 0, high: 0, medium: 1, low: 3 }
    },
    {
      auditor: "Trail of Bits",
      date: "January 2024",
      scope: "Governance & DAO",
      score: "98/100",
      status: "Passed",
      findings: { critical: 0, high: 0, medium: 0, low: 2 }
    }
  ];

  const insuranceCoverage = [
    { risk: "Smart Contract Risk", coverage: "$50M", provider: "Nexus Mutual" },
    { risk: "Oracle Failure", coverage: "$25M", provider: "Bridge Mutual" },
    { risk: "Economic Attacks", coverage: "$20M", provider: "InsurAce" },
    { risk: "Custody Risk", coverage: "$15M", provider: "Nexus Mutual" }
  ];

  const bugBountyProgram = {
    totalPaid: "$125,000",
    activeBounties: 12,
    researchers: 45,
    criticalReward: "Up to $50,000",
    highReward: "Up to $25,000",
    mediumReward: "Up to $10,000",
    lowReward: "Up to $1,000"
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Security <span className="gradient-text">& Audits</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Your security is our top priority. Learn about our comprehensive security measures, 
              audit reports, and insurance coverage.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="card-glassmorphism p-8 hover:glow-purple transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-600">{feature.status}</Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Audit Reports */}
          <Card className="card-glassmorphism p-8 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="mr-3 text-blue-500" />
              Security Audit Reports
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-3">Auditor</th>
                    <th className="text-left text-gray-400 py-3">Date</th>
                    <th className="text-left text-gray-400 py-3">Scope</th>
                    <th className="text-left text-gray-400 py-3">Score</th>
                    <th className="text-left text-gray-400 py-3">Findings</th>
                    <th className="text-left text-gray-400 py-3">Status</th>
                    <th className="text-left text-gray-400 py-3">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {auditReports.map((audit, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-4 text-white font-medium">{audit.auditor}</td>
                      <td className="py-4 text-white">{audit.date}</td>
                      <td className="py-4 text-white">{audit.scope}</td>
                      <td className="py-4">
                        <Badge className="bg-green-600">{audit.score}</Badge>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-300">
                          <div>Critical: {audit.findings.critical}</div>
                          <div>High: {audit.findings.high}</div>
                          <div>Medium: {audit.findings.medium}</div>
                          <div>Low: {audit.findings.low}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className="bg-green-900 text-green-300">
                          {audit.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Button size="sm" variant="outline">
                          View Report
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Insurance Coverage */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="mr-3 text-green-500" />
                Insurance Coverage
              </h2>
              
              <div className="space-y-4">
                {insuranceCoverage.map((insurance, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{insurance.risk}</h3>
                      <Badge className="bg-blue-600">{insurance.coverage}</Badge>
                    </div>
                    <p className="text-gray-400 text-sm">Provider: {insurance.provider}</p>
                    <div className="mt-3">
                      <CheckCircle className="w-4 h-4 text-green-400 inline mr-2" />
                      <span className="text-green-400 text-sm">Active Coverage</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Total Coverage</h3>
                <p className="text-2xl font-bold text-green-400">$110M</p>
                <p className="text-gray-400 text-sm">Across all risk categories</p>
              </div>
            </Card>

            {/* Bug Bounty Program */}
            <Card className="card-glassmorphism p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="mr-3 text-orange-500" />
                Bug Bounty Program
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-400">{bugBountyProgram.totalPaid}</p>
                    <p className="text-gray-400 text-sm">Total Paid</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-400">{bugBountyProgram.researchers}</p>
                    <p className="text-gray-400 text-sm">Researchers</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Reward Tiers</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Critical:</span>
                      <span className="text-red-400 font-semibold">{bugBountyProgram.criticalReward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">High:</span>
                      <span className="text-orange-400 font-semibold">{bugBountyProgram.highReward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Medium:</span>
                      <span className="text-yellow-400 font-semibold">{bugBountyProgram.mediumReward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Low:</span>
                      <span className="text-green-400 font-semibold">{bugBountyProgram.lowReward}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Join Bug Bounty Program
                </Button>
              </div>
            </Card>
          </div>

          {/* Security Best Practices */}
          <Card className="card-glassmorphism p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Security Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">For Users</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Never share your private keys or seed phrases</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Always verify contract addresses before interacting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Use hardware wallets for large amounts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Keep your browser and wallet software updated</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Be cautious of phishing attempts and fake websites</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Our Commitments</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Regular security audits by top firms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Comprehensive insurance coverage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Open source code for transparency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Active bug bounty program</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">24/7 monitoring and incident response</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Security;
