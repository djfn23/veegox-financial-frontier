
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

    const alchemyApiKey = Deno.env.get('ALCHEMY_API_KEY')
    if (!alchemyApiKey) {
      throw new Error('ALCHEMY_API_KEY not configured')
    }

    // Use Alchemy's Enhanced APIs
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`

    // Sync token balances from blockchain
    await syncTokenBalances(supabaseClient, walletAddress, userId, alchemyUrl)

    // Sync transaction history
    await syncTransactionHistory(supabaseClient, walletAddress, userId, alchemyUrl)

    return new Response(
      JSON.stringify({ success: true, message: 'Wallet synced successfully with Alchemy' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error syncing wallet with Alchemy:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function syncTokenBalances(supabase: any, walletAddress: string, userId: string, alchemyUrl: string) {
  const tokenContracts = {
    'VEX': Deno.env.get('VEX_CONTRACT_ADDRESS'),
    'sVEX': Deno.env.get('SVEX_CONTRACT_ADDRESS'),
    'gVEX': Deno.env.get('GVEX_CONTRACT_ADDRESS')
  }

  // Get all token balances using Alchemy's getTokenBalances
  try {
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [walletAddress, Object.values(tokenContracts).filter(Boolean)]
      })
    })

    if (response.ok) {
      const data = await response.json()
      const tokenBalances = data.result?.tokenBalances || []

      for (const tokenBalance of tokenBalances) {
        const contractAddress = tokenBalance.contractAddress.toLowerCase()
        const balance = parseInt(tokenBalance.tokenBalance || '0', 16) / Math.pow(10, 18)

        // Find token type by contract address
        let tokenType = 'VEX'
        for (const [type, address] of Object.entries(tokenContracts)) {
          if (address && address.toLowerCase() === contractAddress) {
            tokenType = type
            break
          }
        }

        await supabase
          .from('token_balances')
          .upsert({
            user_id: userId,
            wallet_address: walletAddress,
            token_type: tokenType,
            balance: balance
          }, {
            onConflict: 'user_id,token_type'
          })

        console.log(`Synced ${tokenType} balance: ${balance} for ${walletAddress}`)
      }
    }
  } catch (error) {
    console.error('Error syncing token balances with Alchemy:', error)
  }
}

async function syncTransactionHistory(supabase: any, walletAddress: string, userId: string, alchemyUrl: string) {
  try {
    // Get asset transfers using Alchemy's getAssetTransfers
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromBlock: '0x0',
          toBlock: 'latest',
          fromAddress: walletAddress,
          toAddress: walletAddress,
          category: ['erc20', 'external'],
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: '0x32' // 50 transactions
        }]
      })
    })

    if (response.ok) {
      const data = await response.json()
      const transfers = data.result?.transfers || []
      
      for (const transfer of transfers) {
        const isOutgoing = transfer.from.toLowerCase() === walletAddress.toLowerCase()
        
        await supabase
          .from('blockchain_transactions')
          .upsert({
            transaction_hash: transfer.hash,
            user_id: userId,
            from_address: transfer.from,
            to_address: transfer.to,
            token_type: transfer.asset || 'VEX',
            amount: parseFloat(transfer.value || '0'),
            transaction_type: 'transfer',
            status: 'confirmed',
            block_number: parseInt(transfer.blockNum, 16),
            confirmed_at: new Date().toISOString()
          }, {
            onConflict: 'transaction_hash'
          })
      }

      console.log(`Synced ${transfers.length} transactions for ${walletAddress}`)
    }
  } catch (error) {
    console.error('Error syncing transaction history with Alchemy:', error)
  }
}
