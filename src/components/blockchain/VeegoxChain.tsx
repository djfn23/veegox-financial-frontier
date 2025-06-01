
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Activity, 
  Zap, 
  Users, 
  Clock,
  TrendingUp,
  Shield,
  Server,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { VeegoxChainConfig, VeegoxNode, VeegoxBlock, VeegoxValidator } from '@/types/veegoxchain';

const VeegoxChain = () => {
  const [chainConfig, setChainConfig] = useState<VeegoxChainConfig | null>(null);
  const [nodes, setNodes] = useState<VeegoxNode[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<VeegoxBlock[]>([]);
  const [validators, setValidators] = useState<VeegoxValidator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeVeegoxChain();
    const interval = setInterval(fetchChainData, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const initializeVeegoxChain = async () => {
    setIsLoading(true);
    try {
      // Initialize VeegoxChain configuration
      const config: VeegoxChainConfig = {
        chainId: 0x7645782, // 123456789 in hex
        name: 'VeegoxChain',
        symbol: 'VGX',
        rpcUrl: 'https://veegoxchain-mainnet.g.alchemy.com/v2',
        wsUrl: 'wss://veegoxchain-mainnet.g.alchemy.com/v2',
        explorerUrl: 'https://explorer.veegoxchain.com',
        consensus: 'PoS',
        blockTime: 3,
        gasLimit: BigInt('30000000'),
        validators: []
      };

      setChainConfig(config);
      await deployVeegoxChain(config);
    } catch (error) {
      console.error('Error initializing VeegoxChain:', error);
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser VeegoxChain",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deployVeegoxChain = async (config: VeegoxChainConfig) => {
    try {
      const { data, error } = await supabase.functions.invoke('veegoxchain-manager', {
        body: {
          action: 'deploy_chain',
          config: config
        }
      });

      if (error) throw error;

      toast({
        title: "VeegoxChain Déployée",
        description: "Blockchain VeegoxChain initialisée avec succès"
      });

      await fetchChainData();
    } catch (error: any) {
      console.error('Error deploying VeegoxChain:', error);
      throw error;
    }
  };

  const fetchChainData = async () => {
    try {
      // Fetch nodes status
      const { data: nodesData } = await supabase.functions.invoke('veegoxchain-manager', {
        body: { action: 'get_nodes_status' }
      });

      if (nodesData?.nodes) {
        setNodes(nodesData.nodes);
      }

      // Fetch latest blocks
      const { data: blocksData } = await supabase.functions.invoke('veegoxchain-manager', {
        body: { action: 'get_latest_blocks' }
      });

      if (blocksData?.blocks) {
        setLatestBlocks(blocksData.blocks);
      }

      // Fetch validators
      const { data: validatorsData } = await supabase.functions.invoke('veegoxchain-manager', {
        body: { action: 'get_validators' }
      });

      if (validatorsData?.validators) {
        setValidators(validatorsData.validators);
      }
    } catch (error) {
      console.error('Error fetching chain data:', error);
    }
  };

  const addValidator = async (address: string, stake: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('veegoxchain-manager', {
        body: {
          action: 'add_validator',
          address: address,
          stake: stake
        }
      });

      if (error) throw error;

      toast({
        title: "Validateur ajouté",
        description: `Nouveau validateur ajouté à VeegoxChain`
      });

      await fetchChainData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!chainConfig) {
    return (
      <Card className="card-glassmorphism p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Initialisation de VeegoxChain...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chain Overview */}
      <Card className="card-glassmorphism p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{chainConfig.name}</h2>
              <p className="text-gray-400">Chain ID: {chainConfig.chainId}</p>
            </div>
          </div>
          <Badge className="bg-green-600 text-white">
            <Activity className="w-4 h-4 mr-1" />
            Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Block Time</span>
            </div>
            <span className="text-xl font-bold text-white">{chainConfig.blockTime}s</span>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">Validateurs</span>
            </div>
            <span className="text-xl font-bold text-white">{validators.length}</span>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Server className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400">Nœuds</span>
            </div>
            <span className="text-xl font-bold text-white">{nodes.length}</span>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-gray-400">Dernier Block</span>
            </div>
            <span className="text-xl font-bold text-white">
              {latestBlocks[0]?.number || 0}
            </span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="nodes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nodes">Nœuds</TabsTrigger>
          <TabsTrigger value="validators">Validateurs</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <Card key={node.id} className="bg-gray-800/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">{node.id}</span>
                  </div>
                  <Badge className={node.status === 'online' ? 'bg-green-600' : 'bg-red-600'}>
                    {node.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Région:</span>
                    <span className="text-white">{node.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Block Height:</span>
                    <span className="text-white">{node.blockHeight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peers:</span>
                    <span className="text-white">{node.peers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white">{node.version}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="validators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validators.map((validator, index) => (
              <Card key={validator.address} className="bg-gray-800/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-white">Validateur #{index + 1}</span>
                  </div>
                  <Badge className={validator.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                    {validator.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Adresse:</span>
                    <span className="text-white font-mono text-xs">
                      {validator.address.slice(0, 10)}...{validator.address.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stake:</span>
                    <span className="text-white">{Number(validator.stake) / 1e18} VGX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commission:</span>
                    <span className="text-white">{validator.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-white">{validator.uptime}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <div className="space-y-3">
            {latestBlocks.map((block) => (
              <Card key={block.hash} className="bg-gray-800/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold">#{block.number}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Block {block.number}</p>
                      <p className="text-gray-400 text-sm">
                        {block.transactions.length} transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{new Date(block.timestamp * 1000).toLocaleTimeString()}</p>
                    <p className="text-gray-400 text-sm">
                      Gas: {Number(block.gasUsed).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card className="bg-gray-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration VeegoxChain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nom de la chaîne</label>
                <input
                  type="text"
                  value={chainConfig.name}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Chain ID</label>
                <input
                  type="text"
                  value={chainConfig.chainId}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Consensus</label>
                <input
                  type="text"
                  value={chainConfig.consensus}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Block Time (s)</label>
                <input
                  type="number"
                  value={chainConfig.blockTime}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-2">RPC URL</label>
                <input
                  type="text"
                  value={chainConfig.rpcUrl}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VeegoxChain;
