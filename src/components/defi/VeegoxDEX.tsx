
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpDown, Zap, TrendingUp, Coins } from 'lucide-react';

interface TokenPair {
  from: string;
  to: string;
  rate: number;
  liquidity: number;
}

const VeegoxDEX = () => {
  const [fromToken, setFromToken] = useState('VEX');
  const [toToken, setToToken] = useState('sVEX');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const { toast } = useToast();

  const tokens = ['VEX', 'sVEX', 'gVEX'];

  useEffect(() => {
    // Simuler les données des paires de tokens
    setTokenPairs([
      { from: 'VEX', to: 'sVEX', rate: 1.05, liquidity: 1250000 },
      { from: 'VEX', to: 'gVEX', rate: 0.95, liquidity: 850000 },
      { from: 'sVEX', to: 'gVEX', rate: 0.90, liquidity: 620000 },
    ]);
  }, []);

  const getCurrentRate = () => {
    const pair = tokenPairs.find(p => 
      (p.from === fromToken && p.to === toToken) ||
      (p.from === toToken && p.to === fromToken)
    );
    
    if (!pair) return 1;
    
    return pair.from === fromToken ? pair.rate : 1 / pair.rate;
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(Number(value))) {
      const rate = getCurrentRate();
      setToAmount((Number(value) * rate).toFixed(6));
    } else {
      setToAmount('');
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }

    setIsSwapping(true);
    
    // Simuler la transaction de swap
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Swap réussi !",
      description: `${fromAmount} ${fromToken} échangés contre ${toAmount} ${toToken}`,
    });
    
    setFromAmount('');
    setToAmount('');
    setIsSwapping(false);
  };

  const getLiquidity = () => {
    const pair = tokenPairs.find(p => 
      (p.from === fromToken && p.to === toToken) ||
      (p.from === toToken && p.to === fromToken)
    );
    return pair?.liquidity || 0;
  };

  return (
    <div className="space-y-6">
      <Card className="card-glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-6 w-6" />
            VeegoxDEX - Échange de Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Token */}
          <div className="space-y-2">
            <Label className="text-white">De</Label>
            <div className="flex gap-2">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.filter(t => t !== toToken).map((token) => (
                    <SelectItem key={token} value={token}>{token}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapTokens}
              className="rounded-full border-gray-600 hover:bg-gray-700"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label className="text-white">Vers</Label>
            <div className="flex gap-2">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.filter(t => t !== fromToken).map((token) => (
                    <SelectItem key={token} value={token}>{token}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Trading Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Taux de change</span>
              <span className="text-white">1 {fromToken} = {getCurrentRate().toFixed(6)} {toToken}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Liquidité</span>
              <span className="text-white">${getLiquidity().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Frais de réseau</span>
              <span className="text-white">0.3%</span>
            </div>
          </div>

          <Button
            onClick={handleSwap}
            disabled={isSwapping || !fromAmount || !toAmount}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isSwapping ? 'Échange en cours...' : 'Échanger'}
          </Button>
        </CardContent>
      </Card>

      {/* Liquidity Pools */}
      <Card className="card-glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-6 w-6" />
            Pools de Liquidité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {tokenPairs.map((pair, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">{pair.from}/{pair.to}</h4>
                    <p className="text-sm text-gray-400">
                      Liquidité: ${pair.liquidity.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-600 mb-2">
                      15.2% APY
                    </Badge>
                    <p className="text-sm text-gray-400">
                      Taux: {pair.rate.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VeegoxDEX;
