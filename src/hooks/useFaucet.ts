
import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { supabase } from '@/integrations/supabase/client';

export const useFaucet = () => {
  const { walletAddress, isConnected } = useWallet();
  const [isEligible, setIsEligible] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastClaimAmount, setLastClaimAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Check eligibility and cooldown status
  const checkEligibility = async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      // Check if user can claim VEX
      const { data: canClaim, error: canClaimError } = await supabase
        .rpc('can_claim_vex', { p_wallet_address: walletAddress });

      if (canClaimError) {
        console.error('Error checking claim eligibility:', canClaimError);
        return;
      }

      setIsEligible(canClaim);

      if (!canClaim) {
        // Get time until next claim
        const { data: timeData, error: timeError } = await supabase
          .rpc('time_until_next_claim', { p_wallet_address: walletAddress });

        if (timeError) {
          console.error('Error getting time until next claim:', timeError);
          return;
        }

        // Convert interval to readable format
        if (timeData) {
          // Parse the PostgreSQL interval string
          const intervalString = timeData.toString();
          console.log('Time data received:', intervalString);
          
          // Extract hours and minutes from interval string
          const timeMatch = intervalString.match(/(\d+):(\d+):(\d+)/);
          if (timeMatch) {
            const hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            setTimeUntilNext(`${hours}h ${minutes}m`);
          } else {
            setTimeUntilNext('0h 0m');
          }
        }
      }

      // Get last claim amount
      const { data: lastClaim, error: lastClaimError } = await supabase
        .from('faucet_claims')
        .select('amount_claimed')
        .eq('wallet_address', walletAddress)
        .order('last_claim_at', { ascending: false })
        .limit(1)
        .single();

      if (!lastClaimError && lastClaim) {
        setLastClaimAmount(lastClaim.amount_claimed);
      }

    } catch (error) {
      console.error('Error checking faucet status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Claim VEX tokens
  const claimVEX = async () => {
    if (!walletAddress || !isConnected || !isEligible) {
      return false;
    }

    setIsClaiming(true);
    
    try {
      // Here we would interact with the smart contract
      // For now, we'll simulate the transaction and record it in the database
      
      // Simulate transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      
      // Record the claim in the database
      const { data, error } = await supabase
        .from('faucet_claims')
        .insert({
          wallet_address: walletAddress,
          amount_claimed: 10,
          transaction_hash: mockTxHash,
          last_claim_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error recording claim:', error);
        return false;
      }

      // Refresh eligibility status
      await checkEligibility();
      
      console.log('VEX claimed successfully!', mockTxHash);
      return true;

    } catch (error) {
      console.error('Error claiming VEX:', error);
      return false;
    } finally {
      setIsClaiming(false);
    }
  };

  // Get claim history
  const getClaimHistory = async () => {
    if (!walletAddress) return [];

    try {
      const { data, error } = await supabase
        .from('faucet_claims')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('last_claim_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching claim history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting claim history:', error);
      return [];
    }
  };

  useEffect(() => {
    if (isConnected && walletAddress) {
      checkEligibility();
    } else {
      setLoading(false);
      setIsEligible(false);
      setTimeUntilNext('');
    }
  }, [walletAddress, isConnected]);

  // Update countdown every minute
  useEffect(() => {
    if (!isEligible && timeUntilNext) {
      const interval = setInterval(() => {
        checkEligibility();
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [isEligible, timeUntilNext]);

  return {
    isEligible,
    timeUntilNext,
    isClaiming,
    lastClaimAmount,
    loading,
    claimVEX,
    getClaimHistory,
    checkEligibility
  };
};
