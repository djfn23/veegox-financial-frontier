
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Alchemy webhook received:', body)

    // Process Alchemy Notify webhook events
    const { webhookId, id, createdAt, type, event } = body

    // Store the raw event
    await supabaseClient
      .from('alchemy_events')
      .insert({
        webhook_id: webhookId,
        event_id: id,
        event_type: type,
        event_data: event,
        created_at: createdAt,
        processed: false
      })

    // Process different types of Alchemy events
    switch (type) {
      case 'ADDRESS_ACTIVITY':
        await processAddressActivity(supabaseClient, event)
        break
      case 'MINED_TRANSACTION':
        await processMinedTransaction(supabaseClient, event)
        break
      case 'DROPPED_TRANSACTION':
        await processDroppedTransaction(supabaseClient, event)
        break
      default:
        console.log('Unknown event type:', type)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing Alchemy webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function processAddressActivity(supabase: any, event: any) {
  const { activity } = event
  
  for (const tx of activity) {
    const { hash, fromAddress, toAddress, value, asset, category } = tx
    
    // Determine token type based on asset
    let tokenType = 'VEX'
    if (asset && asset.toLowerCase().includes('svex')) tokenType = 'sVEX'
    if (asset && asset.toLowerCase().includes('gvex')) tokenType = 'gVEX'

    // Get amount in correct units
    const amount = value ? parseFloat(value) : 0

    // Insert transaction record
    await supabase
      .from('blockchain_transactions')
      .insert({
        transaction_hash: hash,
        from_address: fromAddress,
        to_address: toAddress,
        token_type: tokenType,
        amount: amount,
        transaction_type: category || 'transfer',
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })

    console.log(`Processed address activity: ${amount} ${tokenType} from ${fromAddress} to ${toAddress}`)
  }
}

async function processMinedTransaction(supabase: any, event: any) {
  const { transaction } = event
  const { hash, from, to, value } = transaction

  // Update transaction status to confirmed
  await supabase
    .from('blockchain_transactions')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString()
    })
    .eq('transaction_hash', hash)

  console.log(`Transaction mined: ${hash}`)
}

async function processDroppedTransaction(supabase: any, event: any) {
  const { transaction } = event
  const { hash } = transaction

  // Update transaction status to failed
  await supabase
    .from('blockchain_transactions')
    .update({
      status: 'failed',
      confirmed_at: new Date().toISOString()
    })
    .eq('transaction_hash', hash)

  console.log(`Transaction dropped: ${hash}`)
}
