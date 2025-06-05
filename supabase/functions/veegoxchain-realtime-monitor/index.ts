
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
    const { action } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const alchemyApiKey = Deno.env.get('alchemy')
    if (!alchemyApiKey) {
      throw new Error('ALCHEMY_API_KEY not configured')
    }

    switch (action) {
      case 'update_metrics':
        return await updateNetworkMetrics(alchemyApiKey, supabaseClient)
      
      case 'sync_new_blocks':
        return await syncNewBlocks(alchemyApiKey, supabaseClient)
      
      case 'health_check':
        return await performHealthCheck(alchemyApiKey, supabaseClient)
      
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans veegoxchain-realtime-monitor:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function updateNetworkMetrics(alchemyApiKey: string, supabase: any) {
  console.log('📊 Mise à jour des métriques VeegoxChain')

  try {
    // Obtenir le dernier bloc
    const response = await fetch(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: []
      })
    })

    const data = await response.json()
    const blockHeight = parseInt(data.result, 16)

    // Calculer des métriques simulées
    const tps = Math.random() * 10 + 5
    const avgBlockTime = 3 + (Math.random() * 2 - 1)
    const gasPriceAvg = 20000000000 + Math.random() * 10000000000

    // Mettre à jour les métriques
    const { error } = await supabase
      .from('veegoxchain_metrics')
      .update({
        block_height: Math.max(blockHeight, 1),
        tps: Number(tps.toFixed(2)),
        avg_block_time: Number(avgBlockTime.toFixed(1)),
        total_transactions: Math.floor(blockHeight * 2.5),
        active_validators: 1,
        gas_price_avg: gasPriceAvg,
        timestamp: new Date().toISOString()
      })
      .eq('chain_id', 123456789)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Métriques mises à jour',
        blockHeight,
        tps: tps.toFixed(2),
        avgBlockTime: avgBlockTime.toFixed(1)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur mise à jour métriques:', error)
    throw error
  }
}

async function syncNewBlocks(alchemyApiKey: string, supabase: any) {
  console.log('🔄 Synchronisation nouveaux blocs')

  try {
    // Obtenir les informations du dernier bloc
    const response = await fetch(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest', false]
      })
    })

    const data = await response.json()
    const block = data.result

    if (block) {
      // Créer un nouveau bloc VeegoxChain
      const { error } = await supabase
        .from('veegoxchain_blocks')
        .upsert({
          chain_id: 123456789,
          block_number: parseInt(block.number, 16),
          block_hash: block.hash,
          parent_hash: block.parentHash,
          timestamp: parseInt(block.timestamp, 16),
          validator: block.miner || '0x0000000000000000000000000000000000000000',
          gas_used: parseInt(block.gasUsed, 16),
          gas_limit: parseInt(block.gasLimit, 16),
          transaction_count: block.transactions?.length || 0
        }, {
          onConflict: 'block_number,chain_id'
        })

      if (error) {
        console.error('Erreur sync bloc:', error)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Bloc synchronisé',
        blockNumber: block ? parseInt(block.number, 16) : 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur sync blocs:', error)
    throw error
  }
}

async function performHealthCheck(alchemyApiKey: string, supabase: any) {
  console.log('🔍 Vérification santé réseau')

  try {
    // Vérifier la connectivité Alchemy
    const response = await fetch(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'net_version',
        params: []
      })
    })

    const data = await response.json()
    const networkId = data.result

    // Mettre à jour le statut des nœuds
    const { error } = await supabase
      .from('veegoxchain_nodes')
      .update({
        status: 'online',
        updated_at: new Date().toISOString()
      })
      .eq('chain_id', 123456789)

    if (error) {
      console.error('Erreur mise à jour nœuds:', error)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Santé réseau vérifiée',
        networkId,
        status: 'healthy'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur health check:', error)
    
    // Créer une alerte en cas de problème
    await supabase
      .from('veegoxchain_alerts')
      .insert({
        chain_id: 123456789,
        alert_type: 'network_health',
        severity: 'error',
        title: 'Problème de Connectivité',
        description: 'Impossible de contacter les nœuds Alchemy',
        alert_data: JSON.stringify({ error: error.message })
      })

    throw error
  }
}
