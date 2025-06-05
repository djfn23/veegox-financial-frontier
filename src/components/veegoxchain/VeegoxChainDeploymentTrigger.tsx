
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Rocket, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Play
} from 'lucide-react';

const VeegoxChainDeploymentTrigger = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const contractAddress = '0xF3E1D80dA667D50641f0110F2Bb70882cd16343E';

  const deployVeegoxChain = async () => {
    setIsDeploying(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    try {
      // Étape 1: Initialisation
      setCurrentStep('Initialisation de VeegoxChain...');
      setProgress(25);

      const { data: initData, error: initError } = await supabase.functions.invoke('veegoxchain-initialization', {
        body: {
          action: 'initialize_veegoxchain',
          contractAddress
        }
      });

      if (initError) throw new Error(`Erreur initialisation: ${initError.message}`);

      // Étape 2: Déploiement consensus
      setCurrentStep('Déploiement des contrats de consensus...');
      setProgress(50);

      const { data: consensusData, error: consensusError } = await supabase.functions.invoke('veegoxchain-initialization', {
        body: {
          action: 'deploy_consensus',
          contractAddress
        }
      });

      if (consensusError) throw new Error(`Erreur consensus: ${consensusError.message}`);

      // Étape 3: Synchronisation
      setCurrentStep('Synchronisation du contrat existant...');
      setProgress(75);

      const { data: syncData, error: syncError } = await supabase.functions.invoke('veegoxchain-initialization', {
        body: {
          action: 'sync_existing_contract',
          contractAddress
        }
      });

      if (syncError) throw new Error(`Erreur synchronisation: ${syncError.message}`);

      // Étape 4: Activation
      setCurrentStep('Activation du réseau VeegoxChain...');
      setProgress(100);

      const { data: activationData, error: activationError } = await supabase.functions.invoke('veegoxchain-initialization', {
        body: {
          action: 'activate_network',
          contractAddress
        }
      });

      if (activationError) throw new Error(`Erreur activation: ${activationError.message}`);

      setSuccess(true);
      setCurrentStep('VeegoxChain déployée avec succès !');

      toast({
        title: "🎉 Blockchain Déployée !",
        description: "VeegoxChain est maintenant opérationnelle avec votre contrat",
      });

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur de déploiement",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="card-glassmorphism max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl gradient-text">
              Déployer VeegoxChain
            </CardTitle>
            <p className="text-gray-400 mt-2">
              Déploiement automatique de votre blockchain
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span>Contrat: {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}</span>
          <Badge variant="outline">Sepolia + Alchemy</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isDeploying && !success && !error && (
          <div className="text-center">
            <Button 
              onClick={deployVeegoxChain} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Déployer Maintenant
            </Button>
            <p className="text-sm text-gray-400 mt-3">
              Durée estimée: ~2 minutes
            </p>
          </div>
        )}

        {isDeploying && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{currentStep}</span>
                <span className="text-sm text-gray-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-center gap-2 text-blue-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Déploiement en cours...</span>
            </div>
          </div>
        )}

        {success && (
          <Alert className="border-green-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-600">Déploiement Réussi !</AlertTitle>
            <AlertDescription>
              VeegoxChain est maintenant opérationnelle avec votre contrat {contractAddress}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de Déploiement</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <div className="text-center pt-4">
            <Button 
              onClick={() => window.location.href = '/veegox-chain-admin'}
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              Accéder au Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VeegoxChainDeploymentTrigger;
