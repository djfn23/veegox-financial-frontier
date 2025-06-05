
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
    const { action, chainId, alertData } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'check_network_health':
        return await checkNetworkHealth(chainId, supabaseClient)
      
      case 'monitor_validators':
        return await monitorValidators(chainId, supabaseClient)
      
      case 'create_alert':
        return await createAlert(chainId, alertData, supabaseClient)
      
      case 'get_alerts':
        return await getAlerts(chainId, supabaseClient)
      
      case 'resolve_alert':
        return await resolveAlert(alertData.alertId, supabaseClient)
      
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans veegoxchain-monitoring:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function checkNetworkHealth(chainId: number, supabase: any) {
  console.log(`Vérification de la santé du réseau ${chainId}`)

  // Récupérer les métriques récentes
  const { data: metrics, error: metricsError } = await supabase
    .from('veegoxchain_metrics')
    .select('*')
    .eq('chain_id', chainId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (metricsError) {
    throw metricsError
  }

  // Récupérer les validateurs actifs
  const { data: validators, error: validatorsError } = await supabase
    .from('veegoxchain_validators')
    .select('*')
    .eq('chain_id', chainId)
    .eq('is_active', true)

  if (validatorsError) {
    throw validatorsError
  }

  // Analyser la santé du réseau
  const health = {
    status: 'healthy',
    issues: [],
    metrics: {
      avgBlockTime: metrics.length > 0 ? metrics.reduce((a, b) => a + Number(b.avg_block_time), 0) / metrics.length : 0,
      activeValidators: validators?.length || 0,
      tps: metrics[0]?.tps || 0,
      blockHeight: metrics[0]?.block_height || 0
    }
  }

  // Vérifications de santé
  if (health.metrics.activeValidators < 3) {
    health.status = 'warning'
    health.issues.push('Nombre insuffisant de validateurs actifs')
    
    await createAlert(chainId, {
      alert_type: 'low_validators',
      severity: 'warning',
      title: 'Nombre insuffisant de validateurs',
      description: `Seulement ${health.metrics.activeValidators} validateurs actifs`,
      alert_data: { currentValidators: health.metrics.activeValidators }
    }, supabase)
  }

  if (health.metrics.avgBlockTime > 10) {
    health.status = 'warning'
    health.issues.push('Temps de bloc élevé')
    
    await createAlert(chainId, {
      alert_type: 'slow_blocks',
      severity: 'warning',
      title: 'Temps de bloc élevé',
      description: `Temps moyen de bloc: ${health.metrics.avgBlockTime}s`,
      alert_data: { avgBlockTime: health.metrics.avgBlockTime }
    }, supabase)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      health
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function monitorValidators(chainId: number, supabase: any) {
  console.log('Surveillance des validateurs')

  const { data: validators, error } = await supabase
    .from('veegoxchain_validators')
    .select('*')
    .eq('chain_id', chainId)

  if (error) {
    throw error
  }

  const validatorStats = {
    total: validators?.length || 0,
    active: validators?.filter(v => v.is_active).length || 0,
    inactive: validators?.filter(v => !v.is_active).length || 0,
    averageUptime: validators?.length > 0 ? 
      validators.reduce((a, b) => a + Number(b.uptime), 0) / validators.length : 0
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      validators: validatorStats,
      details: validators
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createAlert(chainId: number, alertData: any, supabase: any) {
  const alert = {
    chain_id: chainId,
    ...alertData,
    resolved: false
  }

  const { error } = await supabase
    .from('veegoxchain_alerts')
    .insert(alert)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Alerte créée'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getAlerts(chainId: number, supabase: any) {
  const { data: alerts, error } = await supabase
    .from('veegoxchain_alerts')
    .select('*')
    .eq('chain_id', chainId)
    .eq('resolved', false)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      alerts: alerts || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function resolveAlert(alertId: string, supabase: any) {
  const { error } = await supabase
    .from('veegoxchain_alerts')
    .update({ 
      resolved: true, 
      resolved_at: new Date().toISOString() 
    })
    .eq('id', alertId)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Alerte résolue'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
