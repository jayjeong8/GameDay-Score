export interface Team {
  id: number;
  team_name: string;
  total_score: number;
  rank: number;
  rank_diff: number;
  created_at: string;
}

export interface ScoreUpdate {
  id: number;
  team_id: number;
  score_change: number;
  game_type: string;
  created_at: string;
}
