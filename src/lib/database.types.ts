/**
 * Hand-written types matching supabase/schema.sql.
 * If you start using `supabase gen types typescript`, replace this file.
 */
export type Stage =
  | 'group'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final';

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';

export interface Profile {
  id: string;
  name: string;
  is_admin: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  external_id: string | null;
  home_team: string;
  away_team: string;
  kickoff: string;
  stage: Stage;
  group_name: string | null;
  venue: string | null;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  updated_at: string;
}

export interface Bet {
  id: string;
  user_id: string;
  match_id: string;
  home_bet: number;
  away_bet: number;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'is_admin'> & {
          created_at?: string;
          is_admin?: boolean;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'updated_at'> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Match>;
        Relationships: [];
      };
      bets: {
        Row: Bet;
        Insert: Omit<Bet, 'id' | 'updated_at'> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Bet>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: { stage: Stage; match_status: MatchStatus };
    CompositeTypes: {};
  };
};
