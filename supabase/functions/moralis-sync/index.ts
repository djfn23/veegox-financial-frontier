
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

    const moralisApiKey = Deno.env.get('MORALIS_API_KEY')
    if (!moralisApiKey) {
      throw new Error('MORALIS_API_KEY not configured')
    }

    // Sync token balances from blockchain
    await syncTokenBalances(supabaseClient, walletAddress, userId, moralisApiKey)

    // Sync transaction history
    await syncTransactionHistory(supabaseClient, walletAddress, userId, moralisApiKey)

    return new Response(
      JSON.stringify({ success: true, message: 'Wallet synced successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error syncing wallet:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function syncTokenBalances(supabase: any, walletAddress: string, userId: string, apiKey: string) {
  const tokenContracts = {
    'VEX': Deno.env.get('VEX_CONTRACT_ADDRESS'),
    'sVEX': Deno.env.get('SVEX_CONTRACT_ADDRESS'),
    'gVEX': Deno.env.get('GVEX_CONTRACT_ADDRESS')
  }

  for (const [tokenType, contractAddress] of Object.entries(tokenContracts)) {
    if (!contractAddress) continue

    try {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=eth&token_addresses%5B0%5D=${contractAddress}`,
        {
          headers: {
            'X-API-Key': apiKey,
            'accept': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const balance = data[0]?.balance ? parseInt(data[0].balance) / Math.pow(10, 18) : 0

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
    } catch (error) {
      console.error(`Error syncing ${tokenType} balance:`, error)
    }
  }
}

async function syncTransactionHistory(supabase: any, walletAddress: string, userId: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2/${walletAddress}?chain=eth&limit=50`,
      {
        headers: {
          'X-API-Key': apiKey,
          'accept': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      
      for (const tx of data.result || []) {
        await supabase
          .from('blockchain_transactions')
          .upsert({
            transaction_hash: tx.hash,
            user_id: userId,
            from_address: tx.from_address,
            to_address: tx.to_address,
            token_type: 'VEX', // Default, should be determined by contract
            amount: parseInt(tx.value) / Math.pow(10, 18),
            transaction_type: 'transfer',
            status: tx.receipt_status === '1' ? 'confirmed' : 'failed',
            block_number: parseInt(tx.block_number),
            gas_used: parseInt(tx.gas_used || '0'),
            gas_price: parseInt(tx.gas_price || '0') / Math.pow(10, 9),
            confirmed_at: new Date(tx.block_timestamp).toISOString()
          }, {
            onConflict: 'transaction_hash'
          })
      }

      console.log(`Synced ${data.result?.length || 0} transactions for ${walletAddress}`)
    }
  } catch (error) {
    console.error('Error syncing transaction history:', error)
  }
}
