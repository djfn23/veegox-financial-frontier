
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, Plug2 } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const WalletConnect = () => {
  const { isConnected, walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (isConnected && walletAddress) {
    return (
      <Card className="card-glassmorphism p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Connected Wallet</p>
              <p className="text-white font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-600">Connected</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-glassmorphism p-6 text-center">
      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Plug2 className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
      <p className="text-gray-400 mb-6">
        Connect your MetaMask wallet to access Veegox tokens and DeFi features
      </p>
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-purple-600 hover:bg-purple-700 w-full"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect MetaMask
          </>
        )}
      </Button>
    </Card>
  );
};

export default WalletConnect;
