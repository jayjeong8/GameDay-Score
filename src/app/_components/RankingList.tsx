"use client";

import type { Team } from "@/app/types";
import type { RealtimePostgresUpdatePayload } from "@supabase/realtime-js/dist/module/RealtimeChannel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import supabase from "@/utils/supabase/supabase";

export default function RankingList({ serverTeams }: { serverTeams: Team[] }) {
  const [teams, setTeams] = useState(serverTeams);

  useEffect(() => {
    setTeams(serverTeams);
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
          setTeams((currentTeams) =>
            currentTeams.map((team) =>
              team.id === payload.new.id ? payload.new : team,
            ),
          );
        },
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(channel);
    };
  }, [serverTeams]);

  return (
    <section>
      <ul className="space-y-2 font-semibold">
        {teams?.map((team) => (
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
