"use server";

import type { Team, ScoreUpdate } from "@/app/types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function getTeamsByScoreAsc() {
  const server = await createClient();

  const { data: teams } = await server
    .from("teams")
    .select("*")
    .order("total_score", { ascending: false });

  return teams as Team[];
}

export async function getTeamsByNameAsc() {
  const server = await createClient();

  const { data: teams } = await server
    .from("teams")
    .select("*")
    .order("team_name");

  return teams as Team[];
}

export async function getScoreUpdates() {
  const server = await createClient();

  const { data: scoreUpdates } = await server
    .from("score_updates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(19);

  return scoreUpdates as ScoreUpdate[];
}

export async function updateTeamScore(
  teamId: number,
  scoreChange: number,
  gameType: string,
) {
  const server = await createClient();

  const { data: team } = await server
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (!team) {
    throw new Error("Team not found");
  }

  // 점수 업데이트 기록 저장
  await server.from("score_updates").insert({
    team_id: teamId,
    team_name: team.team_name,
    score_change: scoreChange,
    game_type: gameType,
  });

  // 팀 점수 업데이트
  await server
    .from("teams")
    .update({
      total_score: team.total_score + scoreChange,
    })
    .eq("id", teamId);

  revalidatePath("/");
}
