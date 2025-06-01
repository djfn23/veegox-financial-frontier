
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VeegoxChainConfig {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  consensus: 'PoS' | 'PoA';
  blockTime: number;
  gasLimit: bigint;
  validators: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, config, address, stake } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const alchemyApiKey = Deno.env.get('alchemy')
    if (!alchemyApiKey) {
      throw new Error('ALCHEMY_API_KEY not configured')
    }

    switch (action) {
      case 'deploy_chain':
        return await deployVeegoxChain(config, alchemyApiKey, supabaseClient)
      
      case 'get_nodes_status':
        return await getNodesStatus(alchemyApiKey, supabaseClient)
      
      case 'get_latest_blocks':
        return await getLatestBlocks(alchemyApiKey, supabaseClient)
      
      case 'get_validators':
        return await getValidators(supabaseClient)
      
      case 'add_validator':
        return await addValidator(address, stake, supabaseClient)
      
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans veegoxchain-manager:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function deployVeegoxChain(config: VeegoxChainConfig, alchemyApiKey: string, supabase: any) {
  console.log('Déploiement de VeegoxChain...')

  // Créer la configuration de la chaîne personnalisée avec Alchemy
  const chainConfig = {
    name: config.name,
    chain_id: config.chainId,
    symbol: config.symbol,
    rpc_url: `${config.rpcUrl}/${alchemyApiKey}`,
    ws_url: `${config.wsUrl}/${alchemyApiKey}`,
    explorer_url: config.explorerUrl,
    consensus: config.consensus,
    block_time: config.blockTime,
    gas_limit: config.gasLimit.toString(),
    is_active: true,
    is_testnet: false
  }

  // Enregistrer la configuration VeegoxChain
  const { error: chainError } = await supabase
    .from('veegoxchain_config')
    .upsert(chainConfig, {
      onConflict: 'chain_id'
    })

  if (chainError) {
    console.error('Erreur insertion chaîne:', chainError)
    throw chainError
  }

  // Initialiser les nœuds Alchemy pour VeegoxChain
  const initialNodes = [
    {
      node_id: 'veegox-mainnet-01',
      address: `${config.rpcUrl}/${alchemyApiKey}`,
      region: 'us-east-1',
      status: 'online',
      block_height: 1,
      peers: 8,
      version: '1.0.0',
      chain_id: config.chainId
    },
    {
      node_id: 'veegox-mainnet-02',
      address: `${config.rpcUrl}/${alchemyApiKey}`,
      region: 'eu-west-1',
      status: 'online',
      block_height: 1,
      peers: 12,
      version: '1.0.0',
      chain_id: config.chainId
    },
    {
      node_id: 'veegox-mainnet-03',
      address: `${config.rpcUrl}/${alchemyApiKey}`,
      region: 'ap-southeast-1',
      status: 'online',
      block_height: 1,
      peers: 6,
      version: '1.0.0',
      chain_id: config.chainId
    }
  ]

  for (const node of initialNodes) {
    const { error: nodeError } = await supabase
      .from('veegoxchain_nodes')
      .upsert(node, {
        onConflict: 'node_id'
      })

    if (nodeError) {
      console.error('Erreur insertion nœud:', nodeError)
    }
  }

  // Créer le bloc Genesis
  await createGenesisBlock(config.chainId, supabase)

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'VeegoxChain déployée avec succès',
      chainId: config.chainId,
      config: chainConfig
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createGenesisBlock(chainId: number, supabase: any) {
  const genesisBlock = {
    block_number: 0,
    block_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    parent_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: Math.floor(Date.now() / 1000),
    validator: '0x0000000000000000000000000000000000000000',
    gas_used: 0,
    gas_limit: 30000000,
    transaction_count: 0,
    chain_id: chainId
  }

  const { error } = await supabase
    .from('veegoxchain_blocks')
    .upsert(genesisBlock, {
      onConflict: 'block_number,chain_id'
    })

  if (error) {
    console.error('Erreur création bloc Genesis:', error)
  }
}

async function getNodesStatus(alchemyApiKey: string, supabase: any) {
  try {
    const { data: nodes, error } = await supabase
      .from('veegoxchain_nodes')
      .select('*')
      .order('node_id')

    if (error) throw error

    // Simuler la mise à jour du statut des nœuds
    const updatedNodes = nodes?.map(node => ({
      id: node.node_id,
      address: node.address,
      status: Math.random() > 0.1 ? 'online' : 'offline',
      blockHeight: Math.floor(Math.random() * 1000) + 1000,
      peers: Math.floor(Math.random() * 20) + 5,
      version: node.version,
      region: node.region
    })) || []

    return new Response(
      JSON.stringify({ 
        success: true, 
        nodes: updatedNodes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur récupération nœuds:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getLatestBlocks(alchemyApiKey: string, supabase: any) {
  try {
    const { data: blocks, error } = await supabase
      .from('veegoxchain_blocks')
      .select('*')
      .order('block_number', { ascending: false })
      .limit(10)

    if (error) throw error

    const formattedBlocks = blocks?.map(block => ({
      number: block.block_number,
      hash: block.block_hash,
      parentHash: block.parent_hash,
      timestamp: block.timestamp,
      transactions: [], // À implémenter
      validator: block.validator,
      gasUsed: BigInt(block.gas_used),
      gasLimit: BigInt(block.gas_limit)
    })) || []

    return new Response(
      JSON.stringify({ 
        success: true, 
        blocks: formattedBlocks
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur récupération blocks:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getValidators(supabase: any) {
  try {
    const { data: validators, error } = await supabase
      .from('veegoxchain_validators')
      .select('*')
      .order('stake', { ascending: false })

    if (error) throw error

    const formattedValidators = validators?.map(validator => ({
      address: validator.validator_address,
      stake: BigInt(validator.stake),
      commissionRate: validator.commission_rate,
      isActive: validator.is_active,
      delegators: validator.delegators || 0,
      uptime: validator.uptime || 100
    })) || []

    return new Response(
      JSON.stringify({ 
        success: true, 
        validators: formattedValidators
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur récupération validateurs:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function addValidator(address: string, stake: string, supabase: any) {
  try {
    const validator = {
      validator_address: address,
      stake: stake,
      commission_rate: 5.0, // 5% par défaut
      is_active: true,
      delegators: 0,
      uptime: 100.0
    }

    const { error } = await supabase
      .from('veegoxchain_validators')
      .insert(validator)

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Validateur ajouté avec succès'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur ajout validateur:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
