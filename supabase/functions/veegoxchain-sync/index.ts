
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
    const { action, chainId, data } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const alchemyApiKey = Deno.env.get('alchemy')
    if (!alchemyApiKey) {
      throw new Error('ALCHEMY_API_KEY not configured')
    }

    switch (action) {
      case 'sync_blocks':
        return await syncBlocks(chainId, data, supabaseClient)
      
      case 'sync_transactions':
        return await syncTransactions(chainId, data, supabaseClient)
      
      case 'sync_events':
        return await syncEvents(chainId, data, supabaseClient)
      
      case 'sync_metrics':
        return await syncMetrics(chainId, data, supabaseClient)
      
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans veegoxchain-sync:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function syncBlocks(chainId: number, blocks: any[], supabase: any) {
  console.log(`Synchronisation de ${blocks.length} blocs pour la chaîne ${chainId}`)

  for (const block of blocks) {
    const blockData = {
      chain_id: chainId,
      block_number: block.number,
      block_hash: block.hash,
      parent_hash: block.parentHash,
      timestamp: block.timestamp,
      validator: block.miner || '0x0000000000000000000000000000000000000000',
      gas_used: parseInt(block.gasUsed || '0'),
      gas_limit: parseInt(block.gasLimit || '30000000'),
      transaction_count: block.transactions?.length || 0
    }

    const { error } = await supabase
      .from('veegoxchain_blocks')
      .upsert(blockData, {
        onConflict: 'block_number,chain_id'
      })

    if (error) {
      console.error('Erreur sync bloc:', error)
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `${blocks.length} blocs synchronisés`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncTransactions(chainId: number, transactions: any[], supabase: any) {
  console.log(`Synchronisation de ${transactions.length} transactions`)

  for (const tx of transactions) {
    const txData = {
      chain_id: chainId,
      transaction_hash: tx.hash,
      from_address: tx.from,
      to_address: tx.to,
      value: tx.value,
      gas_price: tx.gasPrice,
      gas_used: parseInt(tx.gasUsed || '0'),
      block_number: tx.blockNumber,
      block_hash: tx.blockHash,
      status: tx.status === '0x1' ? 'success' : 'failed'
    }

    const { error } = await supabase
      .from('veegoxchain_transactions')
      .upsert(txData, {
        onConflict: 'transaction_hash'
      })

    if (error) {
      console.error('Erreur sync transaction:', error)
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `${transactions.length} transactions synchronisées`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncEvents(chainId: number, events: any[], supabase: any) {
  console.log(`Synchronisation de ${events.length} événements`)

  for (const event of events) {
    const eventData = {
      chain_id: chainId,
      contract_address: event.address,
      event_name: event.event || 'Unknown',
      event_data: event.returnValues || {},
      transaction_hash: event.transactionHash,
      block_number: event.blockNumber,
      block_hash: event.blockHash,
      log_index: event.logIndex,
      processed: false
    }

    const { error } = await supabase
      .from('veegoxchain_events')
      .upsert(eventData, {
        onConflict: 'transaction_hash,log_index'
      })

    if (error) {
      console.error('Erreur sync événement:', error)
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `${events.length} événements synchronisés`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncMetrics(chainId: number, metrics: any, supabase: any) {
  console.log('Synchronisation des métriques')

  const metricsData = {
    chain_id: chainId,
    block_height: metrics.blockHeight || 0,
    tps: metrics.tps || 0,
    avg_block_time: metrics.avgBlockTime || 0,
    total_transactions: metrics.totalTransactions || 0,
    active_validators: metrics.activeValidators || 0,
    network_hashrate: metrics.networkHashrate || '0',
    gas_price_avg: metrics.gasPriceAvg || 0
  }

  const { error } = await supabase
    .from('veegoxchain_metrics')
    .insert(metricsData)

  if (error) {
    console.error('Erreur sync métriques:', error)
    throw error
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Métriques synchronisées'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
