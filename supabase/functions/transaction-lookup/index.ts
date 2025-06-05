
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

    const alchemyApiKey = Deno.env.get('ALCHEMY_API_KEY')
    if (!alchemyApiKey) {
      throw new Error('ALCHEMY_API_KEY not configured')
    }

    console.log(`Recherche de la transaction: ${transactionHash}`)

    // Chercher d'abord dans notre base de données
    const { data: localTransaction, error: localError } = await supabaseClient
      .from('blockchain_transactions')
      .select('*')
      .eq('transaction_hash', transactionHash)
      .single()

    if (localTransaction) {
      console.log('Transaction trouvée dans la base de données locale')
      return new Response(
        JSON.stringify({ 
          found: true, 
          source: 'local',
          transaction: localTransaction 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Si non trouvée localement, chercher sur la blockchain via Alchemy
    console.log('Transaction non trouvée localement, recherche sur la blockchain...')
    
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [transactionHash]
      })
    })

    const blockchainData = await response.json()
    
    if (blockchainData.result) {
      console.log('Transaction trouvée sur la blockchain')
      
      // Sauvegarder la transaction dans notre base de données
      const transactionData = {
        transaction_hash: transactionHash,
        from_address: blockchainData.result.from,
        to_address: blockchainData.result.to,
        block_number: parseInt(blockchainData.result.blockNumber, 16),
        gas_used: parseInt(blockchainData.result.gas, 16),
        gas_price: parseInt(blockchainData.result.gasPrice, 16),
        amount: parseFloat(blockchainData.result.value) / Math.pow(10, 18), // Convert wei to ETH
        token_type: 'VEX', // Default, might need to be determined from contract interaction
        transaction_type: 'transfer',
        status: blockchainData.result.blockNumber ? 'confirmed' : 'pending',
        confirmed_at: new Date().toISOString()
      }

      const { error: insertError } = await supabaseClient
        .from('blockchain_transactions')
        .insert(transactionData)

      if (insertError) {
        console.error('Erreur lors de la sauvegarde:', insertError)
      }

      return new Response(
        JSON.stringify({ 
          found: true, 
          source: 'blockchain',
          transaction: transactionData,
          raw: blockchainData.result
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Transaction introuvable')
    return new Response(
      JSON.stringify({ 
        found: false, 
        message: 'Transaction not found in database or blockchain',
        searched: {
          database: true,
          blockchain: true,
          transactionHash: transactionHash
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur lors de la recherche de transaction:', error)
    return new Response(
      JSON.stringify({ 
        found: false,
        error: error.message,
        transactionHash: transactionHash || 'unknown'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
