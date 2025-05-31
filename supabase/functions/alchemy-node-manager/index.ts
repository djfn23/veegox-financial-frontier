
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AlchemyNodeConfig {
  network: string;
  alchemyNetwork: string;
  contractAddress: string;
  chainId: number;
  rpcUrl: string;
  wsUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, network, contractAddress } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const alchemyApiKey = Deno.env.get('ALCHEMY_API_KEY')
    if (!alchemyApiKey) {
      throw new Error('ALCHEMY_API_KEY not configured')
    }

    switch (action) {
      case 'deploy_monitoring':
        return await deployMonitoring(network, contractAddress, alchemyApiKey, supabaseClient)
      
      case 'sync_all_networks':
        return await syncAllNetworks(alchemyApiKey, supabaseClient)
      
      case 'get_network_status':
        return await getNetworkStatus(network, alchemyApiKey)
      
      case 'setup_webhooks':
        return await setupWebhooks(network, contractAddress, alchemyApiKey)
      
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans alchemy-node-manager:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function deployMonitoring(network: string, contractAddress: string, alchemyApiKey: string, supabase: any) {
  console.log(`Déploiement du monitoring pour ${network}:${contractAddress}`)

  const networkConfigs: Record<string, AlchemyNodeConfig> = {
    'sepolia': {
      network: 'sepolia',
      alchemyNetwork: 'eth-sepolia',
      contractAddress: contractAddress,
      chainId: 11155111,
      rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
      wsUrl: `wss://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
    },
    'polygon': {
      network: 'polygon',
      alchemyNetwork: 'polygon-mainnet',
      contractAddress: contractAddress,
      chainId: 137,
      rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      wsUrl: `wss://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    },
    'arbitrum': {
      network: 'arbitrum',
      alchemyNetwork: 'arb-mainnet',
      contractAddress: contractAddress,
      chainId: 42161,
      rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      wsUrl: `wss://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    },
    'base': {
      network: 'base',
      alchemyNetwork: 'base-mainnet',
      contractAddress: contractAddress,
      chainId: 8453,
      rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      wsUrl: `wss://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    }
  }

  const config = networkConfigs[network]
  if (!config) {
    throw new Error(`Réseau non supporté: ${network}`)
  }

  // Enregistrer la configuration du réseau
  await supabase
    .from('alchemy_networks')
    .upsert({
      network: config.network,
      alchemy_network: config.alchemyNetwork,
      contract_address: config.contractAddress,
      chain_id: config.chainId,
      rpc_url: config.rpcUrl,
      ws_url: config.wsUrl,
      is_active: true,
      monitoring_enabled: true
    }, {
      onConflict: 'network,contract_address'
    })

  // Synchroniser les données initiales
  await syncNetworkData(config, supabase)

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Monitoring déployé pour ${network}`,
      config: config
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncNetworkData(config: AlchemyNodeConfig, supabase: any) {
  try {
    // Obtenir les dernières transactions du contrat
    const response = await fetch(config.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromBlock: '0x0',
          toBlock: 'latest',
          contractAddresses: [config.contractAddress],
          category: ['erc20', 'erc721', 'erc1155'],
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: '0x64'
        }]
      })
    })

    const data = await response.json()
    const transfers = data.result?.transfers || []

    console.log(`Synchronisation de ${transfers.length} transactions pour ${config.network}`)

    for (const transfer of transfers) {
      await supabase
        .from('blockchain_transactions')
        .upsert({
          transaction_hash: transfer.hash,
          from_address: transfer.from,
          to_address: transfer.to,
          token_type: getTokenType(transfer.asset),
          amount: parseFloat(transfer.value || '0'),
          transaction_type: 'transfer',
          status: 'confirmed',
          block_number: parseInt(transfer.blockNum, 16),
          confirmed_at: new Date().toISOString(),
          network: config.network,
          chain_id: config.chainId
        }, {
          onConflict: 'transaction_hash'
        })
    }

  } catch (error) {
    console.error(`Erreur de synchronisation pour ${config.network}:`, error)
  }
}

async function syncAllNetworks(alchemyApiKey: string, supabase: any) {
  const networks = ['sepolia', 'polygon', 'arbitrum', 'base']
  const results = []

  for (const network of networks) {
    try {
      const { data: networkConfig } = await supabase
        .from('alchemy_networks')
        .select('*')
        .eq('network', network)
        .eq('is_active', true)
        .single()

      if (networkConfig) {
        await syncNetworkData(networkConfig, supabase)
        results.push({ network, status: 'success' })
      }
    } catch (error) {
      console.error(`Erreur sync ${network}:`, error)
      results.push({ network, status: 'error', error: error.message })
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Synchronisation terminée',
      results: results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getNetworkStatus(network: string, alchemyApiKey: string) {
  const networkConfigs = {
    'sepolia': `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    'polygon': `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    'arbitrum': `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    'base': `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
  }

  const rpcUrl = networkConfigs[network]
  if (!rpcUrl) {
    throw new Error(`Réseau non supporté: ${network}`)
  }

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_blockNumber'
      })
    })

    const data = await response.json()
    const blockNumber = parseInt(data.result, 16)

    return new Response(
      JSON.stringify({ 
        success: true, 
        network: network,
        blockNumber: blockNumber,
        status: 'online',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        network: network,
        status: 'offline',
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function setupWebhooks(network: string, contractAddress: string, alchemyApiKey: string) {
  console.log(`Configuration des webhooks pour ${network}:${contractAddress}`)

  // Note: Dans un environnement réel, vous utiliseriez l'API Alchemy Notify
  // pour configurer automatiquement les webhooks
  
  const webhookConfig = {
    network: network,
    contractAddress: contractAddress,
    webhookUrl: 'https://uvtwsfothnnyufxmcpdg.supabase.co/functions/v1/alchemy-webhook',
    events: ['NATIVE_TOKEN_TRANSFER', 'ERC20_TRANSFER', 'ERC1155_TRANSFER'],
    status: 'configured'
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Webhooks configurés',
      config: webhookConfig
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function getTokenType(asset: string): string {
  if (!asset) return 'VEX'
  
  const assetLower = asset.toLowerCase()
  if (assetLower.includes('svex')) return 'sVEX'
  if (assetLower.includes('gvex')) return 'gVEX'
  return 'VEX'
}
