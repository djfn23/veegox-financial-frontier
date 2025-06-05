
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentConfig {
  chainId: number;
  name: string;
  symbol: string;
  consensus: string;
  blockTime: number;
  gasLimit: string;
  stakingRequirement: string;
  network: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, config, txHash, addresses } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const alchemyApiKey = Deno.env.get('alchemy')
    if (!alchemyApiKey) {
      throw new Error('ALCHEMY_API_KEY not configured')
    }

    switch (action) {
      case 'deploy_veegoxchain':
        return await deployVeegoxChain(config, supabaseClient)
      
      case 'record_deployment':
        return await recordDeployment(config, addresses, txHash, supabaseClient)
      
      case 'update_deployment_status':
        return await updateDeploymentStatus(config.chainId, txHash, supabaseClient)
      
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans veegoxchain-deployment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function deployVeegoxChain(config: DeploymentConfig, supabase: any) {
  console.log('Démarrage du déploiement VeegoxChain...')

  // Enregistrer la configuration initiale
  const chainConfig = {
    name: config.name,
    chain_id: config.chainId,
    symbol: config.symbol,
    rpc_url: `https://eth-sepolia.g.alchemy.com/v2`,
    ws_url: `wss://eth-sepolia.g.alchemy.com/v2`,
    explorer_url: 'https://sepolia.etherscan.io',
    consensus: config.consensus,
    block_time: config.blockTime,
    gas_limit: config.gasLimit,
    is_active: true,
    is_testnet: true,
    network_type: config.network,
    network_status: 'deploying'
  }

  const { error: chainError } = await supabase
    .from('veegoxchain_config')
    .upsert(chainConfig, {
      onConflict: 'chain_id'
    })

  if (chainError) {
    console.error('Erreur insertion chaîne:', chainError)
    throw chainError
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Déploiement VeegoxChain initié',
      chainId: config.chainId,
      config: chainConfig
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function recordDeployment(config: DeploymentConfig, addresses: any, txHash: string, supabase: any) {
  console.log('Enregistrement du déploiement...')

  // Enregistrer le déploiement
  const deployment = {
    chain_id: config.chainId,
    network: config.network,
    deployer_address: addresses.deployer,
    consensus_address: addresses.consensus,
    validator_address: addresses.validator,
    token_address: addresses.token,
    deployment_tx_hash: txHash,
    deployment_block: addresses.blockNumber || 0,
    gas_used: addresses.gasUsed || 0,
    deployment_cost: addresses.cost || 0,
    status: 'deployed'
  }

  const { error: deployError } = await supabase
    .from('veegoxchain_deployments')
    .insert(deployment)

  if (deployError) {
    console.error('Erreur enregistrement déploiement:', deployError)
    throw deployError
  }

  // Mettre à jour la configuration avec les adresses
  const { error: updateError } = await supabase
    .from('veegoxchain_config')
    .update({
      consensus_address: addresses.consensus,
      validator_address: addresses.validator,
      token_address: addresses.token,
      deployment_tx_hash: txHash,
      deployment_block: addresses.blockNumber || 0,
      network_status: 'active'
    })
    .eq('chain_id', config.chainId)

  if (updateError) {
    console.error('Erreur mise à jour config:', updateError)
    throw updateError
  }

  // Créer une alerte de succès
  await supabase
    .from('veegoxchain_alerts')
    .insert({
      chain_id: config.chainId,
      alert_type: 'deployment_success',
      severity: 'info',
      title: 'VeegoxChain déployée avec succès',
      description: `La blockchain VeegoxChain a été déployée sur ${config.network}`,
      alert_data: { addresses, txHash }
    })

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Déploiement enregistré avec succès',
      deployment
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateDeploymentStatus(chainId: number, txHash: string, supabase: any) {
  const { error } = await supabase
    .from('veegoxchain_deployments')
    .update({ status: 'confirmed' })
    .eq('chain_id', chainId)
    .eq('deployment_tx_hash', txHash)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Statut mis à jour' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
