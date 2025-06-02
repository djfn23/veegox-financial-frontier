
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
    const { transactionHash } = await req.json()
    
    if (!transactionHash) {
      throw new Error('Transaction hash is required')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Looking up transaction:', transactionHash)

    // First, check local database
    const { data: localTx, error: localError } = await supabaseClient
      .from('blockchain_transactions')
      .select('*')
      .eq('transaction_hash', transactionHash)
      .single()

    if (localTx && !localError) {
      console.log('Transaction found in local database')
      return new Response(
        JSON.stringify({
          found: true,
          source: 'local',
          transaction: localTx
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // If not found locally, check blockchain via Alchemy
    const alchemyKey = Deno.env.get('ALCHEMY_API_KEY')
    if (!alchemyKey) {
      throw new Error('Alchemy API key not configured')
    }

    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`

    console.log('Checking blockchain via Alchemy...')

    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [transactionHash],
        id: 1
      })
    })

    const data = await response.json()

    if (data.result) {
      console.log('Transaction found on blockchain')
      
      // Get transaction receipt for more details
      const receiptResponse = await fetch(alchemyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [transactionHash],
          id: 1
        })
      })

      const receiptData = await receiptResponse.json()
      const receipt = receiptData.result

      // Convert blockchain data to our format
      const transaction = {
        transaction_hash: transactionHash,
        from_address: data.result.from,
        to_address: data.result.to,
        amount: parseInt(data.result.value, 16) / Math.pow(10, 18), // Convert wei to ETH
        token_type: 'ETH', // Default to ETH for now
        status: receipt?.status === '0x1' ? 'confirmed' : 'failed',
        block_number: parseInt(data.result.blockNumber, 16),
        transaction_type: 'transfer',
        confirmed_at: new Date().toISOString()
      }

      return new Response(
        JSON.stringify({
          found: true,
          source: 'blockchain',
          transaction: transaction,
          raw: data.result
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Transaction not found anywhere
    console.log('Transaction not found')
    return new Response(
      JSON.stringify({
        found: false,
        error: 'Transaction not found in database or blockchain'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in transaction-lookup:', error)
    return new Response(
      JSON.stringify({ 
        found: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
