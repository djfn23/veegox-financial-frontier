
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
  Network,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

interface LaunchStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
}

const VeegoxChainAutoLauncher = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [deploymentInfo, setDeploymentInfo] = useState<any>(null);
  const { toast } = useToast();

  const contractAddress = '0xF3E1D80dA667D50641f0110F2Bb70882cd16343E';

  const launchSteps: LaunchStep[] = [
    {
      id: 'initialize',
      title: 'Initialisation VeegoxChain',
      description: 'Configuration de la blockchain avec votre contrat',
      status: 'pending'
    },
    {
      id: 'deploy_consensus',
      title: 'Déploiement Consensus',
      description: 'Création des contrats de gouvernance PoS',
      status: 'pending'
    },
    {
      id: 'sync_contract',
      title: 'Synchronisation Token',
      description: 'Import des données du contrat existant',
      status: 'pending'
    },
    {
      id: 'activate_network',
      title: 'Activation Réseau',
      description: 'Mise en ligne de VeegoxChain',
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState(launchSteps);

  const updateStepStatus = (stepIndex: number, status: LaunchStep['status']) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const executeStep = async (stepIndex: number): Promise<boolean> => {
    const step = steps[stepIndex];
    setCurrentStep(stepIndex);
    updateStepStatus(stepIndex, 'running');

    try {
      let result;
      
      switch (step.id) {
        case 'initialize':
          result = await supabase.functions.invoke('veegoxchain-initialization', {
            body: {
              action: 'initialize_veegoxchain',
              contractAddress
            }
          });
          break;
          
        case 'deploy_consensus':
          result = await supabase.functions.invoke('veegoxchain-initialization', {
            body: {
              action: 'deploy_consensus',
              contractAddress
            }
          });
          break;
          
        case 'sync_contract':
          result = await supabase.functions.invoke('veegoxchain-initialization', {
            body: {
              action: 'sync_existing_contract',
              contractAddress
            }
          });
          break;
          
        case 'activate_network':
          result = await supabase.functions.invoke('veegoxchain-initialization', {
            body: {
              action: 'activate_network',
              contractAddress
            }
          });
          break;
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      updateStepStatus(stepIndex, 'completed');
      
      if (step.id === 'activate_network' && result.data) {
        setDeploymentInfo(result.data);
      }

      // Simuler une durée pour chaque étape
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (err: any) {
      updateStepStatus(stepIndex, 'error');
      throw err;
    }
  };

  const launchVeegoxChain = async () => {
    setIsLaunching(true);
    setError(null);
    setProgress(0);

    try {
      for (let i = 0; i < steps.length; i++) {
        await executeStep(i);
        setProgress(((i + 1) / steps.length) * 100);
      }

      toast({
        title: "🎉 VeegoxChain Déployée !",
        description: "Votre blockchain est maintenant opérationnelle avec Alchemy",
      });

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur de déploiement",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const getStepIcon = (status: LaunchStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <Card className="card-glassmorphism">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl gradient-text">
                VeegoxChain Auto-Launcher
              </CardTitle>
              <p className="text-gray-400 mt-2">
                Déploiement automatique avec Alchemy et votre contrat
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>Contrat: {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}</span>
            <Badge variant="outline">Sepolia Testnet</Badge>
          </div>
        </CardHeader>

        <CardContent>
          {!isLaunching && !deploymentInfo && (
            <div className="text-center">
              <Button 
                onClick={launchVeegoxChain} 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Lancer VeegoxChain
              </Button>
              <p className="text-sm text-gray-400 mt-3">
                Durée estimée: ~5 minutes
              </p>
            </div>
          )}

          {isLaunching && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      index === currentStep ? 'border-blue-500 bg-blue-50/10' : 'border-gray-700'
                    }`}
                  >
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{step.title}</h3>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                    <Badge 
                      variant={step.status === 'completed' ? 'default' : 'outline'}
                      className={
                        step.status === 'completed' ? 'bg-green-600' :
                        step.status === 'running' ? 'bg-blue-600' :
                        step.status === 'error' ? 'bg-red-600' : ''
                      }
                    >
                      {step.status === 'completed' ? 'Terminé' :
                       step.status === 'running' ? 'En cours' :
                       step.status === 'error' ? 'Erreur' : 'En attente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de déploiement</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {deploymentInfo && (
            <div className="space-y-4">
              <Alert className="border-green-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-600">Déploiement Réussi !</AlertTitle>
                <AlertDescription>
                  VeegoxChain est maintenant opérationnelle avec votre contrat
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="h-4 w-4 text-purple-400" />
                      <span className="font-medium">Réseau</span>
                    </div>
                    <p className="text-sm text-gray-400">VeegoxChain (Chain ID: 123456789)</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span className="font-medium">RPC URL</span>
                    </div>
                    <p className="text-xs text-gray-400 break-all">{deploymentInfo.rpcUrl}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">Token Natif</span>
                    </div>
                    <p className="text-xs text-gray-400 break-all">{contractAddress}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="font-medium">Consensus</span>
                    </div>
                    <p className="text-sm text-gray-400">Proof of Stake (PoS)</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center pt-4">
                <Button 
                  onClick={() => window.location.href = '/veegox-chain-admin'}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  Accéder au Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VeegoxChainAutoLauncher;
