
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVeegoxChain } from '@/hooks/useVeegoxChain';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Gauge,
  Network,
  Users,
  Zap
} from 'lucide-react';

const VeegoxChainDashboard = () => {
  const { 
    config, 
    metrics, 
    alerts, 
    isLoading, 
    error,
    checkNetworkHealth,
    resolveAlert,
    refreshData
  } = useVeegoxChain();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!config) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>VeegoxChain non configurée</AlertTitle>
        <AlertDescription>
          VeegoxChain n'est pas encore déployée. Utilisez le script de déploiement pour commencer.
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'deploying': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            VeegoxChain Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Surveillance et gestion de votre blockchain VeegoxChain
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant="outline" 
            className={`${getStatusColor(config.networkStatus)} text-white`}
          >
            {config.networkStatus?.toUpperCase() || 'UNKNOWN'}
          </Badge>
          <Button onClick={refreshData} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Configuration de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Configuration Réseau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Nom</p>
              <p className="font-semibold">{config.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Chain ID</p>
              <p className="font-semibold">{config.chainId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Consensus</p>
              <p className="font-semibold">{config.consensus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Block Time</p>
              <p className="font-semibold">{config.blockTime}s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
          <TabsTrigger value="alerts">
            Alertes {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {alerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Block Height</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.blockHeight.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">TPS</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.tps.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">transactions/sec</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temps de Bloc</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.avgBlockTime.toFixed(1)}s</div>
                  <p className="text-xs text-muted-foreground">temps moyen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Validateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.activeValidators}</div>
                  <p className="text-xs text-muted-foreground">actifs</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-400">Aucune métrique disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4">
            {config.consensusAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Contrat de Consensus</CardTitle>
                  <CardDescription>Gestion du consensus PoS de VeegoxChain</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {config.consensusAddress}
                  </p>
                </CardContent>
              </Card>
            )}

            {config.validatorAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Contrat de Validation</CardTitle>
                  <CardDescription>Gestion des validateurs et du staking</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {config.validatorAddress}
                  </p>
                </CardContent>
              </Card>
            )}

            {config.tokenAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Token Natif VGX</CardTitle>
                  <CardDescription>Token natif de VeegoxChain</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {config.tokenAddress}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} variant={getSeverityColor(alert.severity) as any}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    {alert.title}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{alert.severity}</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Résoudre
                      </Button>
                    </div>
                  </AlertTitle>
                  <AlertDescription>
                    {alert.description}
                    <p className="text-xs mt-2 opacity-75">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-600">Aucune alerte active</p>
                  <p className="text-gray-400">VeegoxChain fonctionne correctement</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VeegoxChainDashboard;
