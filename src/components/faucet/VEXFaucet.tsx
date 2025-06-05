
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useFaucet } from '@/hooks/useFaucet';
import { useToast } from '@/hooks/use-toast';

const VEXFaucet = () => {
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const { 
    isEligible, 
    timeUntilNext, 
    isClaiming, 
    lastClaimAmount, 
    loading, 
    claimVEX,
    getClaimHistory 
  } = useFaucet();
  const { toast } = useToast();
  const [claimHistory, setClaimHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadClaimHistory();
    }
  }, [isConnected, walletAddress]);

  const loadClaimHistory = async () => {
    const history = await getClaimHistory();
    setClaimHistory(history);
  };

  const handleClaim = async () => {
    const success = await claimVEX();
    
    if (success) {
      toast({
        title: "VEX Claimed Successfully!",
        description: "10 VEX tokens have been sent to your wallet.",
      });
      loadClaimHistory();
    } else {
      toast({
        title: "Claim Failed",
        description: "There was an error claiming your VEX tokens. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (!isConnected) {
    return (
      <Card className="veegox-card p-6 text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coins className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">VEX Faucet</h3>
        <p className="text-gray-400 mb-6">
          Connect your wallet to claim free VEX tokens
        </p>
        <Button onClick={connectWallet} className="veegox-button-primary">
          Connect Wallet
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Faucet Card */}
      <Card className="veegox-card p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 veegox-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">VEX Faucet</h2>
          <p className="text-gray-400">Claim 10 VEX tokens every 24 hours</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Connected Wallet</span>
            <Badge className="bg-green-600">Connected</Badge>
          </div>
          <p className="text-white font-mono text-sm">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
            <p className="text-gray-400">Checking eligibility...</p>
          </div>
        ) : (
          <>
            {isEligible ? (
              <div className="text-center">
                <div className="flex items-center justify-center text-green-400 mb-4">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Ready to Claim!</span>
                </div>
                <Button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="veegox-button-primary w-full text-lg py-6"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Claiming VEX...
                    </>
                  ) : (
                    <>
                      <Coins className="w-5 h-5 mr-2" />
                      Claim 10 VEX
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center text-orange-400 mb-4">
                  <Clock className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Cooldown Active</span>
                </div>
                <p className="text-gray-400 mb-4">
                  You can claim again in <span className="text-white font-semibold">{timeUntilNext}</span>
                </p>
                <Button disabled className="w-full text-lg py-6 opacity-50">
                  <Clock className="w-5 h-5 mr-2" />
                  Wait for Cooldown
                </Button>
              </div>
            )}
          </>
        )}

        {lastClaimAmount > 0 && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-center text-blue-400">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Last claim: {lastClaimAmount} VEX</span>
            </div>
          </div>
        )}
      </Card>

      {/* Claim History */}
      {claimHistory.length > 0 && (
        <Card className="veegox-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Claim History</h3>
          <div className="space-y-3">
            {claimHistory.slice(0, 5).map((claim, index) => (
              <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{claim.amount_claimed} VEX</p>
                    <p className="text-gray-400 text-sm">{formatTimeAgo(claim.last_claim_at)}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                  Claimed
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Faucet Info */}
      <Card className="veegox-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Faucet Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount per claim:</span>
            <span className="text-white">10 VEX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cooldown period:</span>
            <span className="text-white">24 hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <span className="text-white">VeegoxChain</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Token contract:</span>
            <span className="text-white font-mono text-xs">VEX Token</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VEXFaucet;
