
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useVeegoxChain } from '@/hooks/useVeegoxChain';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info,
  AlertCircle,
  XCircle
} from 'lucide-react';

const VeegoxChainAlerts = () => {
  const { alerts, resolveAlert } = useVeegoxChain();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return XCircle;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
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

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-600">Aucune alerte active</p>
            <p className="text-gray-400">VeegoxChain fonctionne correctement</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertes Système ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => {
            const SeverityIcon = getSeverityIcon(alert.severity);
            
            return (
              <Alert key={alert.id} variant={getSeverityColor(alert.severity) as any}>
                <SeverityIcon className="h-4 w-4" />
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
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default VeegoxChainAlerts;
