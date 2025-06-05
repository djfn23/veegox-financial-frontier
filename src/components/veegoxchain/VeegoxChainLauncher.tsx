
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Rocket, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  Loader2
} from 'lucide-react';

const VeegoxChainLauncher = () => {
  const [contractAddress] = useState('0xF3E1D80dA667D50641f0110F2Bb70882cd16343E');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Adresse copiée dans le presse-papiers"
    });
  };

  const deployVeegoxChain = async () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');

    try {
      // Configuration VeegoxChain avec le contrat existant
      const chainConfig = {
        chainId: 0x7645782, // 123456789
        name: 'VeegoxChain',
        symbol: 'VGX',
        rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2',
        wsUrl: 'wss://eth-sepolia.g.alchemy.com/v2',
        explorerUrl: 'https://sepolia.etherscan.io',
        consensus: 'PoS',
        blockTime: 3,
        gasLimit: '30000000',
        validators: [],
        existingContractAddress: contractAddress
      };

      // Déployer via la fonction Supabase
      const { data, error } = await supabase.functions.invoke('veegoxchain-manager', {
        body: {
          action: 'deploy_chain',
          config: chainConfig,
          existingContract: contractAddress
        }
      });

      if (error) throw error;

      setDeploymentResult(data);
      setDeploymentStatus('success');

      toast({
        title: "🎉 VeegoxChain Déployée !",
        description: "Blockchain créée avec succès avec votre contrat existant"
      });

    } catch (error: any) {
      console.error('Erreur déploiement:', error);
      setDeploymentStatus('error');
      toast({
        title: "Erreur de déploiement",
        description: error.message || "Impossible de déployer VeegoxChain",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-400" />
            Lancer VeegoxChain
          </CardTitle>
          <CardDescription>
            Créez votre blockchain personnalisée avec le contrat existant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Contrat détecté et vérifié. Prêt pour l'intégration VeegoxChain.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="contract">Adresse du contrat existant</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="contract"
                  value={contractAddress}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(contractAddress)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Chain ID</div>
                <div className="text-lg font-bold text-white">123456789</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Consensus</div>
                <div className="text-lg font-bold text-white">Proof of Stake</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Block Time</div>
                <div className="text-lg font-bold text-white">3 secondes</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Réseau</div>
                <div className="text-lg font-bold text-white">Sepolia</div>
              </div>
            </div>

            <Button 
              onClick={deployVeegoxChain}
              disabled={isDeploying}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Déploiement en cours...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Créer VeegoxChain
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statut du déploiement */}
      {deploymentStatus !== 'idle' && (
        <Card className="card-glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {deploymentStatus === 'deploying' && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
              {deploymentStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
              {deploymentStatus === 'error' && <AlertTriangle className="h-5 w-5 text-red-400" />}
              Statut du déploiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Statut</span>
                <Badge className={
                  deploymentStatus === 'deploying' ? 'bg-blue-600' :
                  deploymentStatus === 'success' ? 'bg-green-600' : 'bg-red-600'
                }>
                  {deploymentStatus === 'deploying' && 'En cours...'}
                  {deploymentStatus === 'success' && 'Succès'}
                  {deploymentStatus === 'error' && 'Erreur'}
                </Badge>
              </div>

              {deploymentResult && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Informations de déploiement :</div>
                  <div className="bg-gray-800/50 p-3 rounded font-mono text-xs">
                    <div>Chain ID: {deploymentResult.chainId}</div>
                    <div>Contrat intégré: {contractAddress}</div>
                  </div>
                </div>
              )}

              {deploymentStatus === 'success' && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/veegoxchain" className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Voir la blockchain
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/veegoxchain-admin" className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Administration
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VeegoxChainLauncher;
