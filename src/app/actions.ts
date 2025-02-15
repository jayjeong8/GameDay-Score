"use server";

import type { Team } from "@/app/types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function getTeamsByRankAsc() {
  const server = await createClient();

  const { data: teams } = await server.from("teams").select("*").order("rank");

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

  // 팀 점수 업데이트
  await server
    .from("teams")
    .update({
      total_score: team.total_score + scoreChange,
    })
    .eq("id", teamId);

  // 전체 순위 재계산
  const { data: allTeams } = await server
    .from("teams")
    .select("*")
    .order("total_score", { ascending: false });

  if (!allTeams) return;

  // 순위 업데이트
  for (let i = 0; i < allTeams.length; i++) {
    const currentTeam = allTeams[i];
    const newRank = i + 1;
    const rankDiff = currentTeam.rank - newRank;

    await server
      .from("teams")
      .update({
        rank: newRank,
        rank_diff: rankDiff,
      })
      .eq("id", currentTeam.id);
  }

  // 점수 업데이트 기록 저장
  await server.from("score_updates").insert({
    team_id: teamId,
    score_change: scoreChange,
    game_type: gameType,
  });

  revalidatePath("/");
}
