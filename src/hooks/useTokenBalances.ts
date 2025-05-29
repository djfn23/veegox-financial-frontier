
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TokenType = 'VEX' | 'sVEX' | 'gVEX';

export interface TokenBalance {
  id: string;
  token_type: TokenType;
  balance: number;
  locked_balance: number;
  updated_at: string;
}

export const useTokenBalances = () => {
  const { data: balances, isLoading, error, refetch } = useQuery({
    queryKey: ['token-balances'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('token_balances')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as TokenBalance[];
    },
    enabled: true
  });

  const getBalanceByType = (tokenType: TokenType): number => {
    const balance = balances?.find(b => b.token_type === tokenType);
    return balance?.balance || 0;
  };

  const getTotalValue = (): number => {
    if (!balances) return 0;
    
    // Mock prices for calculation (in real app, fetch from API)
    const prices = { VEX: 1.25, sVEX: 1.00, gVEX: 2.50 };
    
    return balances.reduce((total, balance) => {
      return total + (balance.balance * prices[balance.token_type]);
    }, 0);
  };

  return {
    balances: balances || [],
    isLoading,
    error,
    refetch,
    getBalanceByType,
    getTotalValue,
    vexBalance: getBalanceByType('VEX'),
    svexBalance: getBalanceByType('sVEX'),
    gvexBalance: getBalanceByType('gVEX')
  };
};
