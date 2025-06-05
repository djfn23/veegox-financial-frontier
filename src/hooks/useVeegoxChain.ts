
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VeegoxChainConfig {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  consensus: string;
  blockTime: number;
  gasLimit: string;
  isActive: boolean;
  isTestnet: boolean;
  consensusAddress?: string;
  validatorAddress?: string;
  tokenAddress?: string;
  networkStatus?: string;
}

interface VeegoxChainMetrics {
  blockHeight: number;
  tps: number;
  avgBlockTime: number;
  totalTransactions: number;
  activeValidators: number;
  networkHashrate: string;
  gasPriceAvg: number;
}

interface VeegoxChainAlert {
  id: string;
  alertType: string;
  severity: string;
  title: string;
  description: string;
  alertData: any;
  resolved: boolean;
  createdAt: string;
}

export const useVeegoxChain = () => {
  const [config, setConfig] = useState<VeegoxChainConfig | null>(null);
  const [metrics, setMetrics] = useState<VeegoxChainMetrics | null>(null);
  const [alerts, setAlerts] = useState<VeegoxChainAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger la configuration VeegoxChain
  const loadConfig = async () => {
    try {
      const { data, error: configError } = await supabase
        .from('veegoxchain_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (configError && configError.code !== 'PGRST116') {
        throw configError;
      }

      if (data) {
        setConfig({
          chainId: data.chain_id,
          name: data.name,
          symbol: data.symbol,
          rpcUrl: data.rpc_url,
          wsUrl: data.ws_url,
          explorerUrl: data.explorer_url,
          consensus: data.consensus,
          blockTime: data.block_time,
          gasLimit: data.gas_limit,
          isActive: data.is_active,
          isTestnet: data.is_testnet,
          consensusAddress: data.consensus_address,
          validatorAddress: data.validator_address,
          tokenAddress: data.token_address,
          networkStatus: data.network_status
        });
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur chargement config VeegoxChain:', err);
    }
  };

  // Charger les métriques récentes
  const loadMetrics = async () => {
    if (!config) return;

    try {
      const { data, error: metricsError } = await supabase
        .from('veegoxchain_metrics')
        .select('*')
        .eq('chain_id', config.chainId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') {
        throw metricsError;
      }

      if (data) {
        setMetrics({
          blockHeight: data.block_height,
          tps: Number(data.tps),
          avgBlockTime: Number(data.avg_block_time),
          totalTransactions: data.total_transactions,
          activeValidators: data.active_validators,
          networkHashrate: data.network_hashrate || '0',
          gasPriceAvg: Number(data.gas_price_avg)
        });
      }
    } catch (err: any) {
      console.error('Erreur chargement métriques:', err);
    }
  };

  // Charger les alertes actives
  const loadAlerts = async () => {
    if (!config) return;

    try {
      const { data, error: alertsError } = await supabase
        .from('veegoxchain_alerts')
        .select('*')
        .eq('chain_id', config.chainId)
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (alertsError) {
        throw alertsError;
      }

      setAlerts(data?.map(alert => ({
        id: alert.id,
        alertType: alert.alert_type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        alertData: alert.alert_data,
        resolved: alert.resolved,
        createdAt: alert.created_at
      })) || []);
    } catch (err: any) {
      console.error('Erreur chargement alertes:', err);
    }
  };

  // Déployer VeegoxChain
  const deployVeegoxChain = async (deploymentConfig: any) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('veegoxchain-deployment', {
        body: {
          action: 'deploy_veegoxchain',
          config: deploymentConfig
        }
      });

      if (error) throw error;

      toast({
        title: "Déploiement initié",
        description: "VeegoxChain est en cours de déploiement",
      });

      await loadConfig();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur de déploiement",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Enregistrer un déploiement
  const recordDeployment = async (config: any, addresses: any, txHash: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('veegoxchain-deployment', {
        body: {
          action: 'record_deployment',
          config,
          addresses,
          txHash
        }
      });

      if (error) throw error;

      toast({
        title: "Déploiement enregistré",
        description: "Les adresses des contrats ont été sauvegardées",
      });

      await loadConfig();
      return data;
    } catch (err: any) {
      console.error('Erreur enregistrement déploiement:', err);
      throw err;
    }
  };

  // Vérifier la santé du réseau
  const checkNetworkHealth = async () => {
    if (!config) return null;

    try {
      const { data, error } = await supabase.functions.invoke('veegoxchain-monitoring', {
        body: {
          action: 'check_network_health',
          chainId: config.chainId
        }
      });

      if (error) throw error;

      return data.health;
    } catch (err: any) {
      console.error('Erreur vérification santé réseau:', err);
      return null;
    }
  };

  // Résoudre une alerte
  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase.functions.invoke('veegoxchain-monitoring', {
        body: {
          action: 'resolve_alert',
          alertData: { alertId }
        }
      });

      if (error) throw error;

      toast({
        title: "Alerte résolue",
        description: "L'alerte a été marquée comme résolue",
      });

      await loadAlerts();
    } catch (err: any) {
      console.error('Erreur résolution alerte:', err);
      toast({
        title: "Erreur",
        description: "Impossible de résoudre l'alerte",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const initializeVeegoxChain = async () => {
      setIsLoading(true);
      await loadConfig();
      setIsLoading(false);
    };

    initializeVeegoxChain();
  }, []);

  useEffect(() => {
    if (config) {
      loadMetrics();
      loadAlerts();

      // Actualiser les données toutes les 30 secondes
      const interval = setInterval(() => {
        loadMetrics();
        loadAlerts();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [config]);

  // S'abonner aux mises à jour en temps réel
  useEffect(() => {
    if (!config) return;

    const channel = supabase
      .channel('veegoxchain-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'veegoxchain_metrics',
        filter: `chain_id=eq.${config.chainId}`
      }, () => {
        loadMetrics();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'veegoxchain_alerts',
        filter: `chain_id=eq.${config.chainId}`
      }, () => {
        loadAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [config]);

  return {
    config,
    metrics,
    alerts,
    isLoading,
    error,
    deployVeegoxChain,
    recordDeployment,
    checkNetworkHealth,
    resolveAlert,
    refreshData: () => {
      loadConfig();
      loadMetrics();
      loadAlerts();
    }
  };
};
