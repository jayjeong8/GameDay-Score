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

  // 전체 팀 조회 (점수 내림차순, 이름 오름차순으로 정렬)
  const { data: allTeams } = await server
    .from("teams")
    .select("*")
    .order("total_score", { ascending: false });

  if (!allTeams) {
    throw new Error("allTeams not found");
  }

  // 순위 업데이트 (동점자 처리)
  let currentRank = 1;

  for (let i = 0; i < allTeams.length; i++) {
    const currentTeam = allTeams[i];

    // 첫 번째 팀이 아닐 경우, 이전 팀과 점수 비교
    if (i > 0) {
      const previousTeam = allTeams[i - 1];

      // 이전 팀과 점수가 다르면 현재 인덱스 + 1을 순위로 사용
      if (previousTeam.total_score !== currentTeam.total_score) {
        currentRank = i + 1;
      }
      // 점수가 같으면 이전 팀과 같은 순위 유지
    }

    const newRank = currentRank;
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
