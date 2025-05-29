
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
    console.log('Moralis webhook received:', body)

    // Process different types of Moralis events
    for (const log of body.logs || []) {
      await supabaseClient
        .from('moralis_events')
        .insert({
          event_type: body.streamId || 'unknown',
          contract_address: log.address,
          transaction_hash: log.transactionHash,
          block_number: parseInt(log.blockNumber),
          log_index: parseInt(log.logIndex),
          event_data: log,
          processed: false
        })

      // Process token transfers
      if (log.topic0 === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
        await processTokenTransfer(supabaseClient, log)
      }

      // Process staking events
      if (log.topic0 === '0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15') {
        await processStakingEvent(supabaseClient, log)
      }

      // Process governance events
      if (log.topic0 === '0x877856338e13f63d0c36822ff0ef736b80934cd90574a3a5bc9262c39d217c46') {
        await processGovernanceEvent(supabaseClient, log)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function processTokenTransfer(supabase: any, log: any) {
  const from = '0x' + log.topic1.slice(26)
  const to = '0x' + log.topic2.slice(26)
  const amount = parseInt(log.data, 16) / Math.pow(10, 18)

  // Determine token type based on contract address
  let tokenType = 'VEX'
  if (log.address.toLowerCase().includes('svex')) tokenType = 'sVEX'
  if (log.address.toLowerCase().includes('gvex')) tokenType = 'gVEX'

  // Insert transaction record
  await supabase
    .from('blockchain_transactions')
    .insert({
      transaction_hash: log.transactionHash,
      from_address: from,
      to_address: to,
      token_type: tokenType,
      amount: amount,
      transaction_type: 'transfer',
      status: 'confirmed',
      block_number: parseInt(log.blockNumber),
      confirmed_at: new Date().toISOString()
    })

  console.log(`Processed token transfer: ${amount} ${tokenType} from ${from} to ${to}`)
}

async function processStakingEvent(supabase: any, log: any) {
  const user = '0x' + log.topic1.slice(26)
  const amount = parseInt(log.data, 16) / Math.pow(10, 18)

  // Insert staking record
  await supabase
    .from('staking_pools')
    .insert({
      wallet_address: user,
      token_type: 'VEX',
      staked_amount: amount,
      apy_rate: 12.5,
      is_active: true
    })

  console.log(`Processed staking event: ${amount} VEX staked by ${user}`)
}

async function processGovernanceEvent(supabase: any, log: any) {
  const proposalId = log.topic1
  const voter = '0x' + log.topic2.slice(26)
  const vote = parseInt(log.topic3, 16) === 1

  // Insert governance vote
  await supabase
    .from('governance_votes')
    .insert({
      proposal_id: proposalId,
      wallet_address: voter,
      vote_choice: vote,
      vote_power: 100, // This should be calculated from user's token balance
      transaction_hash: log.transactionHash
    })

  console.log(`Processed governance vote: ${voter} voted ${vote ? 'for' : 'against'} proposal ${proposalId}`)
}
