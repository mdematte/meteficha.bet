// Tipos gerados para o Meteficha.bet (modo demonstrativo).
// Nenhuma coluna ou tabela deste schema representa dinheiro real,
// deposito, saque, pagamento ou transferencia financeira.
export type AppRole = "admin" | "user";

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
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          image_url?: string | null;
          rtp?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          image_url?: string | null;
          rtp?: number;
          active?: boolean;
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
        };
        Insert: {
          id?: string;
          user_id: string;
          bet_id?: string | null;
          amount_demo: number;
          type: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bet_id?: string | null;
          amount_demo?: number;
          type?: string;
          description?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
