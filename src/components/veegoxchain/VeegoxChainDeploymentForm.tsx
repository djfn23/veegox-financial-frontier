
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useVeegoxChain } from '@/hooks/useVeegoxChain';
import { Rocket, AlertTriangle } from 'lucide-react';

const VeegoxChainDeploymentForm = () => {
  const [deploymentConfig, setDeploymentConfig] = useState({
    name: 'VeegoxChain',
    symbol: 'VGX',
    chainId: 123456789,
    consensus: 'PoS',
    blockTime: 3,
    gasLimit: '30000000',
    stakingRequirement: '1000',
    network: 'sepolia'
  });

  const { deployVeegoxChain, isLoading } = useVeegoxChain();

  const handleDeploy = async () => {
    try {
      await deployVeegoxChain(deploymentConfig);
    } catch (error) {
      console.error('Erreur déploiement:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Déployer VeegoxChain
        </CardTitle>
        <CardDescription>
          Configurez et déployez votre propre instance de VeegoxChain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Le déploiement créera une nouvelle blockchain VeegoxChain avec les paramètres spécifiés.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom de la chaîne</Label>
            <Input
              id="name"
              value={deploymentConfig.name}
              onChange={(e) => setDeploymentConfig(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="symbol">Symbole du token</Label>
            <Input
              id="symbol"
              value={deploymentConfig.symbol}
              onChange={(e) => setDeploymentConfig(prev => ({ ...prev, symbol: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="chainId">Chain ID</Label>
            <Input
              id="chainId"
              type="number"
              value={deploymentConfig.chainId}
              onChange={(e) => setDeploymentConfig(prev => ({ ...prev, chainId: parseInt(e.target.value) }))}
            />
          </div>

          <div>
            <Label htmlFor="network">Réseau</Label>
            <Select
              value={deploymentConfig.network}
              onValueChange={(value) => setDeploymentConfig(prev => ({ ...prev, network: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sepolia">Sepolia Testnet</SelectItem>
                <SelectItem value="goerli">Goerli Testnet</SelectItem>
                <SelectItem value="mainnet">Ethereum Mainnet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="blockTime">Temps de bloc (s)</Label>
            <Input
              id="blockTime"
              type="number"
              value={deploymentConfig.blockTime}
              onChange={(e) => setDeploymentConfig(prev => ({ ...prev, blockTime: parseInt(e.target.value) }))}
            />
          </div>

          <div>
            <Label htmlFor="gasLimit">Gas Limit</Label>
            <Input
              id="gasLimit"
              value={deploymentConfig.gasLimit}
              onChange={(e) => setDeploymentConfig(prev => ({ ...prev, gasLimit: e.target.value }))}
            />
          </div>
        </div>

        <Button 
          onClick={handleDeploy} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Déploiement en cours...' : 'Déployer VeegoxChain'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VeegoxChainDeploymentForm;
