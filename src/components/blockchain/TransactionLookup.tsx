
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TransactionData {
  transaction_hash: string;
  from_address: string;
  to_address: string;
  amount: number;
  token_type: string;
  status: string;
  block_number?: number;
  confirmed_at?: string;
  transaction_type: string;
}

interface LookupResult {
  found: boolean;
  source?: 'local' | 'blockchain';
  transaction?: TransactionData;
  raw?: any;
  error?: string;
}

const TransactionLookup = () => {
  const [transactionHash, setTransactionHash] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!transactionHash.trim()) {
      toast({
        title: "Hash requis",
        description: "Veuillez entrer un hash de transaction",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('transaction-lookup', {
        body: {
          transactionHash: transactionHash.trim()
        }
      });

      if (error) throw error;

      setResult(data);

      if (data.found) {
        toast({
          title: "Transaction trouvée",
          description: `Transaction trouvée via ${data.source === 'local' ? 'base de données locale' : 'blockchain'}`
        });
      } else {
        toast({
          title: "Transaction introuvable",
          description: "Cette transaction n'a pas été trouvée",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: error.message || "Erreur lors de la recherche de la transaction",
        variant: "destructive"
      });
      setResult({
        found: false,
        error: error.message
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getTokenColor = (tokenType: string) => {
    switch (tokenType?.toLowerCase()) {
      case 'vex':
        return 'bg-purple-600';
      case 'svex':
        return 'bg-blue-600';
      case 'gvex':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-glassmorphism p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Recherche de Transaction
        </h3>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Entrez le hash de transaction (0x...)"
            value={transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Exemple de hash pour test */}
        <div className="mt-2">
          <button
            onClick={() => setTransactionHash('953bd2b7e7bde09d200a235620f6fc3f76584d48945b6ce13f9298ac53b6e8c0')}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Exemple: 953bd2b7e7bde09d200a235620f6fc3f76584d48945b6ce13f9298ac53b6e8c0
          </button>
        </div>
      </Card>

      {result && (
        <Card className="card-glassmorphism p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Résultat de recherche</h4>
            {result.found ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>

          {result.found && result.transaction ? (
            <div className="space-y-4">
              {/* Source de la transaction */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Source:</span>
                <Badge className={result.source === 'local' ? 'bg-blue-600' : 'bg-green-600'}>
                  {result.source === 'local' ? 'Base de données' : 'Blockchain'}
                </Badge>
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Hash:</span>
                  <p className="text-white font-mono text-sm break-all">
                    {result.transaction.transaction_hash}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Statut:</span>
                  <Badge className={getStatusColor(result.transaction.status)}>
                    {result.transaction.status}
                  </Badge>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">De:</span>
                  <p className="text-white font-mono text-sm">
                    {result.transaction.from_address}
                  </p>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Vers:</span>
                  <p className="text-white font-mono text-sm">
                    {result.transaction.to_address}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Montant:</span>
                  <span className="text-white font-bold">
                    {result.transaction.amount} 
                  </span>
                  <Badge className={getTokenColor(result.transaction.token_type)}>
                    {result.transaction.token_type}
                  </Badge>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Type:</span>
                  <p className="text-white">
                    {result.transaction.transaction_type}
                  </p>
                </div>

                {result.transaction.block_number && (
                  <div>
                    <span className="text-gray-400 text-sm">Bloc:</span>
                    <p className="text-white">
                      {result.transaction.block_number}
                    </p>
                  </div>
                )}

                {result.transaction.confirmed_at && (
                  <div>
                    <span className="text-gray-400 text-sm">Confirmé le:</span>
                    <p className="text-white text-sm">
                      {new Date(result.transaction.confirmed_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Lien Etherscan */}
              <div className="pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`https://etherscan.io/tx/${result.transaction?.transaction_hash}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voir sur Etherscan
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-white mb-2">Transaction introuvable</p>
              <p className="text-gray-400 text-sm">
                {result.error || 'Cette transaction n\'existe pas dans notre base de données ou sur la blockchain'}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default TransactionLookup;
