export interface Team {
  id: number;
  team_name: string;
  total_score: number;
  created_at: string;
}

export interface TeamWithRank extends Team {
  rank: number;
  rank_diff: number;
}

export interface ScoreUpdate {
  id: number;
  team_id: number;
  team_name: string;
  score_change: number;
  game_type: string;
  created_at: string;
}
