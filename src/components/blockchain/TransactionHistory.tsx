
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  transaction_hash: string;
  from_address: string;
  to_address: string;
  token_type: string;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
  confirmed_at: string;
}

const TransactionHistory = () => {
  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as Transaction[];
    }
  });

  const getTransactionIcon = (type: string, fromAddress: string, userAddress?: string) => {
    const isOutgoing = fromAddress?.toLowerCase() === userAddress?.toLowerCase();
    return isOutgoing ? ArrowUpRight : ArrowDownLeft;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transfer': return 'bg-blue-600';
      case 'stake': return 'bg-purple-600';
      case 'unstake': return 'bg-orange-600';
      case 'swap': return 'bg-cyan-600';
      case 'governance_vote': return 'bg-pink-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="card-glassmorphism p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-glassmorphism p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {!transactions?.length ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => {
            const Icon = getTransactionIcon(tx.transaction_type, tx.from_address);
            
            return (
              <div key={tx.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getTypeColor(tx.transaction_type)}>
                          {tx.transaction_type}
                        </Badge>
                        <Badge className={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                        <Badge variant="outline" className="border-gray-600">
                          {tx.token_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {tx.amount.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 6 
                      })} {tx.token_type}
                    </p>
                    {tx.transaction_hash && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                        onClick={() => window.open(`https://etherscan.io/tx/${tx.transaction_hash}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on Etherscan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default TransactionHistory;
