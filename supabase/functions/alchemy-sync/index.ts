
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { walletAddress, userId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Alchemy API key from secrets
    const alchemyKey = Deno.env.get('ALCHEMY_API_KEY')
    if (!alchemyKey) {
      throw new Error('Alchemy API key not configured')
    }

    // Ethereum Mainnet endpoint
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`

    console.log('Syncing wallet balances for:', walletAddress)

    // Mock token contract addresses (replace with real ones)
    const tokenContracts = {
      VEX: '0x1234567890abcdef1234567890abcdef12345678',
      sVEX: '0xabcdef1234567890abcdef1234567890abcdef12',
      gVEX: '0x9876543210fedcba9876543210fedcba98765432'
    }

    // Sync each token balance
    for (const [tokenType, contractAddress] of Object.entries(tokenContracts)) {
      try {
        // Call Alchemy to get token balance
        const response = await fetch(alchemyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
              {
                to: contractAddress,
                data: `0x70a08231000000000000000000000000${walletAddress.slice(2)}`
              },
              'latest'
            ],
            id: 1
          })
        })

        const data = await response.json()
        
        // Convert hex to decimal (simplified)
        const balanceHex = data.result || '0x0'
        const balance = parseInt(balanceHex, 16) / Math.pow(10, 18) // Assuming 18 decimals

        console.log(`${tokenType} balance:`, balance)

        // Update balance in Supabase
        await supabaseClient
          .from('token_balances')
          .upsert({
            user_id: userId,
            wallet_address: walletAddress,
            token_type: tokenType,
            balance: balance,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,token_type'
          })

      } catch (error) {
        console.error(`Error syncing ${tokenType}:`, error)
      }
    }

    // Get recent transactions using Alchemy
    try {
      const txResponse = await fetch(alchemyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromAddress: walletAddress,
              category: ['erc20'],
              maxCount: 10,
              order: 'desc'
            }
          ],
          id: 1
        })
      })

      const txData = await txResponse.json()
      const transfers = txData.result?.transfers || []

      // Store transactions in database
      for (const transfer of transfers) {
        const tokenType = Object.keys(tokenContracts).find(
          type => tokenContracts[type].toLowerCase() === transfer.rawContract?.address?.toLowerCase()
        )

        if (tokenType) {
          await supabaseClient
            .from('blockchain_transactions')
            .upsert({
              user_id: userId,
              transaction_hash: transfer.hash,
              transaction_type: 'transfer',
              token_type: tokenType,
              amount: parseFloat(transfer.value || '0'),
              from_address: transfer.from,
              to_address: transfer.to,
              status: 'confirmed',
              block_number: parseInt(transfer.blockNum, 16),
              created_at: new Date().toISOString()
            }, {
              onConflict: 'transaction_hash'
            })
        }
      }

    } catch (error) {
      console.error('Error syncing transactions:', error)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Wallet synced successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in alchemy-sync:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
