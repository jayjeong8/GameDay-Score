"use client";

import type { Team, TeamWithRank } from "@/app/types";
import type { RealtimePostgresUpdatePayload } from "@supabase/realtime-js/dist/module/RealtimeChannel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import supabase from "@/utils/supabase/supabase";

export default function RankingList({ serverTeams }: { serverTeams: Team[] }) {
  const [teams, setTeams] = useState<TeamWithRank[]>([]);

  useEffect(() => {
    setTeams(calcTeamsRank(serverTeams, []));
  }, [serverTeams]);

  useEffect(() => {
    const channel = supabase
      .channel("team-ranking")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teams",
        },
        (payload: RealtimePostgresUpdatePayload<Team>) => {
          setTeams((currentTeams) => {
            const sortedTeams = sortTeamsByScore([
              payload.new,
              ...currentTeams.filter((team) => team.id !== payload.new.id),
            ]);
            const teamsWithRank = calcTeamsRank(sortedTeams, teams);

            return teamsWithRank;
          });
        },
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(channel);
    };
  }, [serverTeams, teams]);

  const sortTeamsByScore = (teams: Team[]) =>
    teams.toSorted((a, b) => {
      if (a.total_score === b.total_score) {
        return a.team_name.localeCompare(b.team_name);
      }

      return b.total_score - a.total_score;
    });

  const calcTeamsRank = (
    sortedTeams: Team[],
    oldTeams: TeamWithRank[],
  ): TeamWithRank[] => {
    let prevNewTeam: TeamWithRank = oldTeams[0];

    return sortedTeams.map((team, index) => {
      let currentRank = index + 1;

      // 첫 번째 팀이 아니고, 이전 팀과 점수가 같으면 이전 팀의 순위를 사용
      if (index > 0 && team.total_score === prevNewTeam.total_score) {
        currentRank = prevNewTeam.rank;
      }

      const oldTeam = oldTeams.find((oldTeam) => oldTeam.id === team.id);
      const newTeam: TeamWithRank = {
        ...team,
        rank: currentRank,
        rank_diff: oldTeam?.rank ? oldTeam.rank - currentRank : 0,
      };
      prevNewTeam = newTeam;

      return newTeam;
    });
  };

  return (
    <section>
      <ul className="space-y-2 font-semibold">
        {teams.map((team) => (
          <li
            key={team.id}
            className={cn(
              "flex items-center rounded-lg border border-cyan-400/20 p-4",
              "bg-slate-900/70 bg-linear-to-b from-pink-500/20 to-cyan-800/20 shadow-[inset_0_20px_20px_-18px_rgba(255,255,255,0.3)] drop-shadow-md",
            )}
          >
            <div className="flex w-24 flex-col items-center px-4 text-5xl text-cyan-400/90">
              {team.rank}

              <div className="mt-2 pr-0.5 text-sm font-medium text-slate-400">
                {team.rank_diff === 0 ? (
                  "-"
                ) : (
                  <span
                    className={cn(
                      "pr-0.5",
                      team.rank_diff > 0 ? "text-green-300" : "text-red-300",
                    )}
                  >
                    {team.rank_diff > 0 ? "+" : ""}
                    {team.rank_diff}
                  </span>
                )}
              </div>
            </div>

            <div className="w-30 px-6 text-end text-4xl font-light text-slate-100/95">
              {team.team_name}
            </div>

            <div className="flex grow justify-end pr-7 text-5xl tracking-tighter text-pink-400 tabular-nums">
              {team.total_score}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
