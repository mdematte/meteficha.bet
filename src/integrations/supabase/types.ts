// Tipos gerados para o Meteficha.bet (modo desenvolvimento/homologacao).
// Nenhuma coluna ou tabela deste schema representa dinheiro real,
// deposito, saque, pagamento ou transferencia financeira. Operacoes
// financeiras reais permanecem bloqueadas (ver operation_controls).
export type AppRole = "admin" | "user";

export type IntegrationEnvironment = "development" | "sandbox" | "production";
export type ProviderStatus =
  | "desativado"
  | "configurado"
  | "em_validacao"
  | "sandbox_validado"
  | "aguardando_autorizacao"
  | "producao_autorizada"
  | "erro";
export type GameIntegrationType = "fictitious" | "sandbox" | "production";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          demo_balance: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          demo_balance?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          demo_balance?: number;
          created_at?: string;
        };
      };
      user_roles: {
        Row: { id: string; user_id: string; role: AppRole };
        Insert: { id?: string; user_id: string; role: AppRole };
        Update: { id?: string; user_id?: string; role?: AppRole };
      };
      casino_games: {
        Row: {
          id: string;
          name: string;
          category: string;
          image_url: string | null;
          rtp: number;
          active: boolean;
          created_at: string;
          provider_id: string | null;
          category_id: string | null;
          external_id: string | null;
          description: string | null;
          integration_type: GameIntegrationType;
          environment: IntegrationEnvironment;
          supported_features: Json;
          last_validated_at: string | null;
          availability_status: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          image_url?: string | null;
          rtp?: number;
          active?: boolean;
          created_at?: string;
          provider_id?: string | null;
          category_id?: string | null;
          external_id?: string | null;
          description?: string | null;
          integration_type?: GameIntegrationType;
          environment?: IntegrationEnvironment;
          supported_features?: Json;
          last_validated_at?: string | null;
          availability_status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          image_url?: string | null;
          rtp?: number;
          active?: boolean;
          created_at?: string;
          provider_id?: string | null;
          category_id?: string | null;
          external_id?: string | null;
          description?: string | null;
          integration_type?: GameIntegrationType;
          environment?: IntegrationEnvironment;
          supported_features?: Json;
          last_validated_at?: string | null;
          availability_status?: string;
        };
      };
      game_providers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          integration_type: string;
          environment: IntegrationEnvironment;
          status: ProviderStatus;
          supports_wallet: boolean;
          supports_sso: boolean;
          supports_callbacks: boolean;
          supports_history: boolean;
          docs_url: string | null;
          notes: string | null;
          last_validated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          integration_type?: string;
          environment?: IntegrationEnvironment;
          status?: ProviderStatus;
          supports_wallet?: boolean;
          supports_sso?: boolean;
          supports_callbacks?: boolean;
          supports_history?: boolean;
          docs_url?: string | null;
          notes?: string | null;
          last_validated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          integration_type?: string;
          environment?: IntegrationEnvironment;
          status?: ProviderStatus;
          supports_wallet?: boolean;
          supports_sso?: boolean;
          supports_callbacks?: boolean;
          supports_history?: boolean;
          docs_url?: string | null;
          notes?: string | null;
          last_validated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      integration_sessions: {
        Row: {
          id: string;
          provider_id: string | null;
          game_id: string | null;
          user_id: string | null;
          environment: IntegrationEnvironment;
          status: string;
          session_token: string | null;
          error_message: string | null;
          started_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          provider_id?: string | null;
          game_id?: string | null;
          user_id?: string | null;
          environment?: IntegrationEnvironment;
          status?: string;
          session_token?: string | null;
          error_message?: string | null;
          started_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          provider_id?: string | null;
          game_id?: string | null;
          user_id?: string | null;
          environment?: IntegrationEnvironment;
          status?: string;
          session_token?: string | null;
          error_message?: string | null;
          started_at?: string;
          ended_at?: string | null;
        };
      };
      operation_controls: {
        Row: {
          id: boolean;
          real_bets_enabled: boolean;
          deposits_enabled: boolean;
          withdrawals_enabled: boolean;
          payments_enabled: boolean;
          real_wallet_enabled: boolean;
          production_integrations_enabled: boolean;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          real_bets_enabled?: boolean;
          deposits_enabled?: boolean;
          withdrawals_enabled?: boolean;
          payments_enabled?: boolean;
          real_wallet_enabled?: boolean;
          production_integrations_enabled?: boolean;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          real_bets_enabled?: boolean;
          deposits_enabled?: boolean;
          withdrawals_enabled?: boolean;
          payments_enabled?: boolean;
          real_wallet_enabled?: boolean;
          production_integrations_enabled?: boolean;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity: string;
          entity_id: string | null;
          result: string;
          correlation_id: string;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity: string;
          entity_id?: string | null;
          result?: string;
          correlation_id?: string;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity?: string;
          entity_id?: string | null;
          result?: string;
          correlation_id?: string;
          error_message?: string | null;
          created_at?: string;
        };
      };
      sports_events: {
        Row: {
          id: string;
          competition: string;
          home_team: string;
          away_team: string;
          starts_at: string;
          odds_home: number;
          odds_draw: number;
          odds_away: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          competition: string;
          home_team: string;
          away_team: string;
          starts_at: string;
          odds_home?: number;
          odds_draw?: number;
          odds_away?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          competition?: string;
          home_team?: string;
          away_team?: string;
          starts_at?: string;
          odds_home?: number;
          odds_draw?: number;
          odds_away?: number;
          status?: string;
          created_at?: string;
        };
      };
      demo_bets: {
        Row: {
          id: string;
          user_id: string;
          game_id: string | null;
          event_id: string | null;
          selection: string | null;
          stake_demo: number;
          odds: number | null;
          payout_demo: number;
          status: string;
          created_at: string;
          settled_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          game_id?: string | null;
          event_id?: string | null;
          selection?: string | null;
          stake_demo: number;
          odds?: number | null;
          payout_demo?: number;
          status?: string;
          created_at?: string;
          settled_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          game_id?: string | null;
          event_id?: string | null;
          selection?: string | null;
          stake_demo?: number;
          odds?: number | null;
          payout_demo?: number;
          status?: string;
          created_at?: string;
          settled_at?: string | null;
        };
      };
      demo_ledger: {
        Row: {
          id: string;
          user_id: string;
          bet_id: string | null;
          amount_demo: number;
          type: string;
          description: string | null;
          created_at: string;
          idempotency_key: string | null;
          reference: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          bet_id?: string | null;
          amount_demo: number;
          type: string;
          description?: string | null;
          created_at?: string;
          idempotency_key?: string | null;
          reference?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          bet_id?: string | null;
          amount_demo?: number;
          type?: string;
          description?: string | null;
          created_at?: string;
          idempotency_key?: string | null;
          reference?: string | null;
        };
      };
    };
  };
};
