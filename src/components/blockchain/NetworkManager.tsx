
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Activity, 
  Zap, 
  Globe, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Settings,
  Eye,
  Webhook
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NetworkConfig {
  network: string;
  alchemyNetwork: string;
  contractAddress: string;
  chainId: number;
  rpcUrl: string;
  wsUrl: string;
  isActive: boolean;
  monitoringEnabled: boolean;
}

interface NetworkStatus {
  network: string;
  blockNumber: number;
  status: 'online' | 'offline';
  timestamp: string;
}

const SUPPORTED_NETWORKS = [
  { id: 'sepolia', name: 'Sepolia Testnet', chain: 'Ethereum', color: 'bg-blue-600' },
  { id: 'polygon', name: 'Polygon Mainnet', chain: 'Polygon', color: 'bg-purple-600' },
  { id: 'arbitrum', name: 'Arbitrum One', chain: 'Arbitrum', color: 'bg-cyan-600' },
  { id: 'base', name: 'Base Mainnet', chain: 'Base', color: 'bg-blue-500' },
  { id: 'optimism', name: 'Optimism', chain: 'Optimism', color: 'bg-red-600' }
];

const NetworkManager = () => {
  const [networks, setNetworks] = useState<NetworkConfig[]>([]);
  const [networkStatus, setNetworkStatus] = useState<Record<string, NetworkStatus>>({});
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [deploymentAddress, setDeploymentAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNetworks();
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const loadNetworks = async () => {
    try {
      const { data, error } = await supabase
        .from('alchemy_networks')
        .select('*')
        .order('network');

      if (error) throw error;
      setNetworks(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des réseaux:', error);
    }
  };

  const checkNetworkStatus = async () => {
    for (const network of networks) {
      try {
        const { data, error } = await supabase.functions.invoke('alchemy-node-manager', {
          body: {
            action: 'get_network_status',
            network: network.network
          }
        });

        if (data && data.success) {
          setNetworkStatus(prev => ({
            ...prev,
            [network.network]: data
          }));
        }
      } catch (error) {
        console.error(`Erreur status ${network.network}:`, error);
        setNetworkStatus(prev => ({
          ...prev,
          [network.network]: {
            network: network.network,
            blockNumber: 0,
            status: 'offline',
            timestamp: new Date().toISOString()
          }
        }));
      }
    }
  };

  const deployToNetwork = async () => {
    if (!selectedNetwork || !deploymentAddress) {
      toast({
        title: "Paramètres manquants",
        description: "Sélectionnez un réseau et entrez l'adresse du contrat",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('alchemy-node-manager', {
        body: {
          action: 'deploy_monitoring',
          network: selectedNetwork,
          contractAddress: deploymentAddress
        }
      });

      if (error) throw error;

      toast({
        title: "Monitoring déployé",
        description: `Surveillance active sur ${selectedNetwork}`
      });

      await loadNetworks();
    } catch (error: any) {
      console.error('Erreur de déploiement:', error);
      toast({
        title: "Erreur de déploiement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncAllNetworks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('alchemy-node-manager', {
        body: { action: 'sync_all_networks' }
      });

      if (error) throw error;

      toast({
        title: "Synchronisation terminée",
        description: `${data.results?.length || 0} réseaux synchronisés`
      });
    } catch (error: any) {
      toast({
        title: "Erreur de synchronisation",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebhooks = async (network: string, contractAddress: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('alchemy-node-manager', {
        body: {
          action: 'setup_webhooks',
          network: network,
          contractAddress: contractAddress
        }
      });

      if (error) throw error;

      toast({
        title: "Webhooks configurés",
        description: `Surveillance en temps réel activée pour ${network}`
      });
    } catch (error: any) {
      toast({
        title: "Erreur webhooks",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-glassmorphism p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Network className="w-6 h-6 mr-2" />
          Gestionnaire de Réseaux Alchemy
        </h2>

        <Tabs defaultValue="deploy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deploy">Déploiement</TabsTrigger>
            <TabsTrigger value="monitor">Surveillance</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Réseau cible</label>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un réseau" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_NETWORKS.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${network.color}`}></div>
                          <span>{network.name}</span>
                          <Badge variant="outline">{network.chain}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Adresse du contrat</label>
                <input
                  type="text"
                  value={deploymentAddress}
                  onChange={(e) => setDeploymentAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </div>
            </div>

            <Button
              onClick={deployToNetwork}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Déployer la surveillance
            </Button>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Réseaux actifs</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={syncAllNetworks}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Synchroniser tout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {networks.map((network) => {
                const status = networkStatus[network.network];
                const networkInfo = SUPPORTED_NETWORKS.find(n => n.id === network.network);
                
                return (
                  <Card key={network.network} className="bg-gray-800/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${networkInfo?.color || 'bg-gray-600'}`}></div>
                        <span className="font-medium text-white">{networkInfo?.name || network.network}</span>
                      </div>
                      {status?.status === 'online' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Chain ID:</span>
                        <span className="text-white">{network.chainId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Block:</span>
                        <span className="text-white">{status?.blockNumber?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contrat:</span>
                        <span className="text-white font-mono text-xs">
                          {network.contractAddress.slice(0, 8)}...
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <Badge 
                        className={network.isActive ? 'bg-green-600' : 'bg-gray-600'}
                      >
                        {network.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge 
                        className={network.monitoringEnabled ? 'bg-blue-600' : 'bg-gray-600'}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Monitoring
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <div className="space-y-4">
              {networks.map((network) => {
                const networkInfo = SUPPORTED_NETWORKS.find(n => n.id === network.network);
                
                return (
                  <Card key={network.network} className="bg-gray-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${networkInfo?.color || 'bg-gray-600'}`}></div>
                        <div>
                          <h4 className="font-medium text-white">{networkInfo?.name || network.network}</h4>
                          <p className="text-sm text-gray-400">
                            Contrat: {network.contractAddress.slice(0, 12)}...
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setupWebhooks(network.network, network.contractAddress)}
                        className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                      >
                        <Webhook className="w-4 h-4 mr-2" />
                        Configurer
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default NetworkManager;
