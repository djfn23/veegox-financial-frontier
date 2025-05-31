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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_voting_power: {
        Args: { p_user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_token_balance: {
        Args: {
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
