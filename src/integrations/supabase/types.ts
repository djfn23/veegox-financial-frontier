export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alchemy_events: {
        Row: {
          created_at: string
          event_data: Json
          event_id: string
          event_type: string
          id: string
          processed: boolean
          processed_at: string | null
          webhook_id: string | null
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_id: string
          event_type: string
          id?: string
          processed?: boolean
          processed_at?: string | null
          webhook_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_id?: string
          event_type?: string
          id?: string
          processed?: boolean
          processed_at?: string | null
          webhook_id?: string | null
        }
        Relationships: []
      }
      alchemy_networks: {
        Row: {
          alchemy_network: string
          chain_id: number
          contract_address: string
          created_at: string
          id: string
          is_active: boolean
          monitoring_enabled: boolean
          network: string
          rpc_url: string
          updated_at: string
          ws_url: string
        }
        Insert: {
          alchemy_network: string
          chain_id: number
          contract_address: string
          created_at?: string
          id?: string
          is_active?: boolean
          monitoring_enabled?: boolean
          network: string
          rpc_url: string
          updated_at?: string
          ws_url: string
        }
        Update: {
          alchemy_network?: string
          chain_id?: number
          contract_address?: string
          created_at?: string
          id?: string
          is_active?: boolean
          monitoring_enabled?: boolean
          network?: string
          rpc_url?: string
          updated_at?: string
          ws_url?: string
        }
        Relationships: []
      }
      blockchain_transactions: {
        Row: {
          amount: number
          block_number: number | null
          chain_id: number | null
          confirmed_at: string | null
          created_at: string
          from_address: string | null
          gas_price: number | null
          gas_used: number | null
          id: string
          network: string | null
          network_fee: number | null
          status: Database["public"]["Enums"]["transaction_status"]
          to_address: string | null
          token_type: Database["public"]["Enums"]["token_type"]
          transaction_hash: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          block_number?: number | null
          chain_id?: number | null
          confirmed_at?: string | null
          created_at?: string
          from_address?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          network?: string | null
          network_fee?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          to_address?: string | null
          token_type: Database["public"]["Enums"]["token_type"]
          transaction_hash?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          block_number?: number | null
          chain_id?: number | null
          confirmed_at?: string | null
          created_at?: string
          from_address?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          network?: string | null
          network_fee?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          to_address?: string | null
          token_type?: Database["public"]["Enums"]["token_type"]
          transaction_hash?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      crowdfunding_contributions: {
        Row: {
          amount: number
          contributor_id: string
          created_at: string
          id: string
          project_id: string
          token_type: Database["public"]["Enums"]["token_type"]
          transaction_hash: string | null
        }
        Insert: {
          amount: number
          contributor_id: string
          created_at?: string
          id?: string
          project_id: string
          token_type: Database["public"]["Enums"]["token_type"]
          transaction_hash?: string | null
        }
        Update: {
          amount?: number
          contributor_id?: string
          created_at?: string
          id?: string
          project_id?: string
          token_type?: Database["public"]["Enums"]["token_type"]
          transaction_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crowdfunding_contributions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crowdfunding_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crowdfunding_projects: {
        Row: {
          category: string | null
          created_at: string
          creator_id: string
          current_amount: number
          description: string
          end_date: string
          goal_amount: number
          id: string
          image_url: string | null
          start_date: string
          status: string
          title: string
          token_type: Database["public"]["Enums"]["token_type"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          creator_id: string
          current_amount?: number
          description: string
          end_date: string
          goal_amount: number
          id?: string
          image_url?: string | null
          start_date?: string
          status?: string
          title: string
          token_type: Database["public"]["Enums"]["token_type"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          creator_id?: string
          current_amount?: number
          description?: string
          end_date?: string
          goal_amount?: number
          id?: string
          image_url?: string | null
          start_date?: string
          status?: string
          title?: string
          token_type?: Database["public"]["Enums"]["token_type"]
          updated_at?: string
        }
        Relationships: []
      }
      faucet_claims: {
        Row: {
          amount_claimed: number
          created_at: string
          id: string
          last_claim_at: string
          transaction_hash: string | null
          user_id: string | null
          wallet_address: string
        }
        Insert: {
          amount_claimed?: number
          created_at?: string
          id?: string
          last_claim_at?: string
          transaction_hash?: string | null
          user_id?: string | null
          wallet_address: string
        }
        Update: {
          amount_claimed?: number
          created_at?: string
          id?: string
          last_claim_at?: string
          transaction_hash?: string | null
          user_id?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      governance_proposals: {
        Row: {
          created_at: string
          description: string
          end_date: string
          execution_date: string | null
          id: string
          proposal_id: string
          proposer_address: string
          proposer_user_id: string | null
          quorum_threshold: number
          start_date: string
          status: Database["public"]["Enums"]["proposal_status"]
          title: string
          total_votes: number
          votes_against: number
          votes_for: number
          voting_power_required: number
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          execution_date?: string | null
          id?: string
          proposal_id: string
          proposer_address: string
          proposer_user_id?: string | null
          quorum_threshold?: number
          start_date?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          title: string
          total_votes?: number
          votes_against?: number
          votes_for?: number
          voting_power_required?: number
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          execution_date?: string | null
          id?: string
          proposal_id?: string
          proposer_address?: string
          proposer_user_id?: string | null
          quorum_threshold?: number
          start_date?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          title?: string
          total_votes?: number
          votes_against?: number
          votes_for?: number
          voting_power_required?: number
        }
        Relationships: []
      }
      governance_votes: {
        Row: {
          created_at: string
          id: string
          proposal_id: string | null
          transaction_hash: string | null
          user_id: string | null
          vote_choice: boolean
          vote_power: number
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          proposal_id?: string | null
          transaction_hash?: string | null
          user_id?: string | null
          vote_choice: boolean
          vote_power: number
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          proposal_id?: string | null
          transaction_hash?: string | null
          user_id?: string | null
          vote_choice?: boolean
          vote_power?: number
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "governance_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "governance_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      moralis_events: {
        Row: {
          block_number: number
          contract_address: string
          created_at: string
          event_data: Json
          event_type: string
          id: string
          log_index: number
          processed: boolean | null
          processed_at: string | null
          transaction_hash: string
        }
        Insert: {
          block_number: number
          contract_address: string
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          log_index: number
          processed?: boolean | null
          processed_at?: string | null
          transaction_hash: string
        }
        Update: {
          block_number?: number
          contract_address?: string
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          log_index?: number
          processed?: boolean | null
          processed_at?: string | null
          transaction_hash?: string
        }
        Relationships: []
      }
      staking_pools: {
        Row: {
          apy_rate: number
          id: string
          is_active: boolean | null
          last_reward_date: string | null
          rewards_earned: number
          stake_date: string
          staked_amount: number
          token_type: Database["public"]["Enums"]["token_type"]
          unstake_date: string | null
          user_id: string | null
        }
        Insert: {
          apy_rate?: number
          id?: string
          is_active?: boolean | null
          last_reward_date?: string | null
          rewards_earned?: number
          stake_date?: string
          staked_amount?: number
          token_type: Database["public"]["Enums"]["token_type"]
          unstake_date?: string | null
          user_id?: string | null
        }
        Update: {
          apy_rate?: number
          id?: string
          is_active?: boolean | null
          last_reward_date?: string | null
          rewards_earned?: number
          stake_date?: string
          staked_amount?: number
          token_type?: Database["public"]["Enums"]["token_type"]
          unstake_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      token_balances: {
        Row: {
          balance: number
          id: string
          locked_balance: number
          token_type: Database["public"]["Enums"]["token_type"]
          updated_at: string
          user_id: string | null
          wallet_address: string
        }
        Insert: {
          balance?: number
          id?: string
          locked_balance?: number
          token_type: Database["public"]["Enums"]["token_type"]
          updated_at?: string
          user_id?: string | null
          wallet_address: string
        }
        Update: {
          balance?: number
          id?: string
          locked_balance?: number
          token_type?: Database["public"]["Enums"]["token_type"]
          updated_at?: string
          user_id?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          updated_at: string
          user_id: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          updated_at?: string
          user_id?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          updated_at?: string
          user_id?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      veegoxchain_alerts: {
        Row: {
          alert_data: Json | null
          alert_type: string
          chain_id: number
          created_at: string
          description: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_data?: Json | null
          alert_type: string
          chain_id: number
          created_at?: string
          description: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title: string
        }
        Update: {
          alert_data?: Json | null
          alert_type?: string
          chain_id?: number
          created_at?: string
          description?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title?: string
        }
        Relationships: []
      }
      veegoxchain_blocks: {
        Row: {
          block_hash: string
          block_number: number
          chain_id: number
          created_at: string
          gas_limit: number
          gas_used: number
          id: string
          parent_hash: string
          timestamp: number
          transaction_count: number
          validator: string
        }
        Insert: {
          block_hash: string
          block_number: number
          chain_id: number
          created_at?: string
          gas_limit: number
          gas_used?: number
          id?: string
          parent_hash: string
          timestamp: number
          transaction_count?: number
          validator: string
        }
        Update: {
          block_hash?: string
          block_number?: number
          chain_id?: number
          created_at?: string
          gas_limit?: number
          gas_used?: number
          id?: string
          parent_hash?: string
          timestamp?: number
          transaction_count?: number
          validator?: string
        }
        Relationships: []
      }
      veegoxchain_config: {
        Row: {
          block_time: number
          chain_id: number
          consensus: string
          consensus_address: string | null
          created_at: string
          deployment_block: number | null
          deployment_tx_hash: string | null
          explorer_url: string
          gas_limit: string
          id: string
          is_active: boolean
          is_testnet: boolean
          name: string
          network_status: string | null
          network_type: string | null
          rpc_url: string
          symbol: string
          token_address: string | null
          total_stake: number | null
          total_validators: number | null
          updated_at: string
          validator_address: string | null
          ws_url: string
        }
        Insert: {
          block_time: number
          chain_id: number
          consensus: string
          consensus_address?: string | null
          created_at?: string
          deployment_block?: number | null
          deployment_tx_hash?: string | null
          explorer_url: string
          gas_limit: string
          id?: string
          is_active?: boolean
          is_testnet?: boolean
          name: string
          network_status?: string | null
          network_type?: string | null
          rpc_url: string
          symbol: string
          token_address?: string | null
          total_stake?: number | null
          total_validators?: number | null
          updated_at?: string
          validator_address?: string | null
          ws_url: string
        }
        Update: {
          block_time?: number
          chain_id?: number
          consensus?: string
          consensus_address?: string | null
          created_at?: string
          deployment_block?: number | null
          deployment_tx_hash?: string | null
          explorer_url?: string
          gas_limit?: string
          id?: string
          is_active?: boolean
          is_testnet?: boolean
          name?: string
          network_status?: string | null
          network_type?: string | null
          rpc_url?: string
          symbol?: string
          token_address?: string | null
          total_stake?: number | null
          total_validators?: number | null
          updated_at?: string
          validator_address?: string | null
          ws_url?: string
        }
        Relationships: []
      }
      veegoxchain_deployments: {
        Row: {
          chain_id: number
          consensus_address: string
          created_at: string
          deployer_address: string
          deployment_block: number
          deployment_cost: number | null
          deployment_tx_hash: string
          gas_used: number | null
          id: string
          network: string
          status: string | null
          token_address: string
          validator_address: string
        }
        Insert: {
          chain_id: number
          consensus_address: string
          created_at?: string
          deployer_address: string
          deployment_block: number
          deployment_cost?: number | null
          deployment_tx_hash: string
          gas_used?: number | null
          id?: string
          network: string
          status?: string | null
          token_address: string
          validator_address: string
        }
        Update: {
          chain_id?: number
          consensus_address?: string
          created_at?: string
          deployer_address?: string
          deployment_block?: number
          deployment_cost?: number | null
          deployment_tx_hash?: string
          gas_used?: number | null
          id?: string
          network?: string
          status?: string | null
          token_address?: string
          validator_address?: string
        }
        Relationships: []
      }
      veegoxchain_events: {
        Row: {
          block_hash: string
          block_number: number
          chain_id: number
          contract_address: string
          created_at: string
          event_data: Json
          event_name: string
          id: string
          log_index: number
          processed: boolean | null
          processed_at: string | null
          transaction_hash: string
        }
        Insert: {
          block_hash: string
          block_number: number
          chain_id: number
          contract_address: string
          created_at?: string
          event_data: Json
          event_name: string
          id?: string
          log_index: number
          processed?: boolean | null
          processed_at?: string | null
          transaction_hash: string
        }
        Update: {
          block_hash?: string
          block_number?: number
          chain_id?: number
          contract_address?: string
          created_at?: string
          event_data?: Json
          event_name?: string
          id?: string
          log_index?: number
          processed?: boolean | null
          processed_at?: string | null
          transaction_hash?: string
        }
        Relationships: []
      }
      veegoxchain_metrics: {
        Row: {
          active_validators: number | null
          avg_block_time: number | null
          block_height: number
          chain_id: number
          created_at: string
          gas_price_avg: number | null
          id: string
          network_hashrate: string | null
          timestamp: string
          total_transactions: number | null
          tps: number | null
        }
        Insert: {
          active_validators?: number | null
          avg_block_time?: number | null
          block_height?: number
          chain_id: number
          created_at?: string
          gas_price_avg?: number | null
          id?: string
          network_hashrate?: string | null
          timestamp?: string
          total_transactions?: number | null
          tps?: number | null
        }
        Update: {
          active_validators?: number | null
          avg_block_time?: number | null
          block_height?: number
          chain_id?: number
          created_at?: string
          gas_price_avg?: number | null
          id?: string
          network_hashrate?: string | null
          timestamp?: string
          total_transactions?: number | null
          tps?: number | null
        }
        Relationships: []
      }
      veegoxchain_nodes: {
        Row: {
          address: string
          block_height: number
          chain_id: number
          created_at: string
          id: string
          node_id: string
          peers: number
          region: string
          status: string
          updated_at: string
          version: string
        }
        Insert: {
          address: string
          block_height?: number
          chain_id: number
          created_at?: string
          id?: string
          node_id: string
          peers?: number
          region: string
          status: string
          updated_at?: string
          version: string
        }
        Update: {
          address?: string
          block_height?: number
          chain_id?: number
          created_at?: string
          id?: string
          node_id?: string
          peers?: number
          region?: string
          status?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      veegoxchain_transactions: {
        Row: {
          block_hash: string | null
          block_number: number | null
          chain_id: number
          created_at: string
          from_address: string
          gas_price: string
          gas_used: number
          id: string
          status: string
          to_address: string
          transaction_hash: string
          value: string
        }
        Insert: {
          block_hash?: string | null
          block_number?: number | null
          chain_id: number
          created_at?: string
          from_address: string
          gas_price: string
          gas_used: number
          id?: string
          status: string
          to_address: string
          transaction_hash: string
          value: string
        }
        Update: {
          block_hash?: string | null
          block_number?: number | null
          chain_id?: number
          created_at?: string
          from_address?: string
          gas_price?: string
          gas_used?: number
          id?: string
          status?: string
          to_address?: string
          transaction_hash?: string
          value?: string
        }
        Relationships: []
      }
      veegoxchain_validators: {
        Row: {
          blocks_proposed: number | null
          chain_id: number
          commission_rate: number
          created_at: string
          delegators: number
          id: string
          is_active: boolean
          joined_at: string | null
          last_active_at: string | null
          last_block_proposed: number | null
          rewards_earned: number | null
          slash_count: number | null
          stake: string
          updated_at: string
          uptime: number
          validator_address: string
        }
        Insert: {
          blocks_proposed?: number | null
          chain_id?: number
          commission_rate?: number
          created_at?: string
          delegators?: number
          id?: string
          is_active?: boolean
          joined_at?: string | null
          last_active_at?: string | null
          last_block_proposed?: number | null
          rewards_earned?: number | null
          slash_count?: number | null
          stake: string
          updated_at?: string
          uptime?: number
          validator_address: string
        }
        Update: {
          blocks_proposed?: number | null
          chain_id?: number
          commission_rate?: number
          created_at?: string
          delegators?: number
          id?: string
          is_active?: boolean
          joined_at?: string | null
          last_active_at?: string | null
          last_block_proposed?: number | null
          rewards_earned?: number | null
          slash_count?: number | null
          stake?: string
          updated_at?: string
          uptime?: number
          validator_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_claim_vex: {
        Args: { p_wallet_address: string }
        Returns: boolean
      }
      get_voting_power: {
        Args: { p_user_id: string }
        Returns: number
      }
      has_role: {
        Args:
          | { _user_id: string; _role: Database["public"]["Enums"]["app_role"] }
          | { role_name: string }
        Returns: boolean
      }
      time_until_next_claim: {
        Args: { p_wallet_address: string }
        Returns: unknown
      }
      update_token_balance: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_user_id: string
              p_wallet_address: string
              p_token_type: Database["public"]["Enums"]["token_type"]
              p_amount: number
              p_operation: string
            }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      proposal_status: "active" | "passed" | "failed" | "executed"
      token_type: "VEX" | "sVEX" | "gVEX"
      transaction_status: "pending" | "confirmed" | "failed"
      transaction_type:
        | "mint"
        | "burn"
        | "transfer"
        | "stake"
        | "unstake"
        | "swap"
        | "governance_vote"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      proposal_status: ["active", "passed", "failed", "executed"],
      token_type: ["VEX", "sVEX", "gVEX"],
      transaction_status: ["pending", "confirmed", "failed"],
      transaction_type: [
        "mint",
        "burn",
        "transfer",
        "stake",
        "unstake",
        "swap",
        "governance_vote",
      ],
    },
  },
} as const
