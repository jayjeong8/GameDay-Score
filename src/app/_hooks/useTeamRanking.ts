import type { Team, TeamWithRank } from "@/app/types";
import type { RealtimePostgresUpdatePayload } from "@supabase/realtime-js/dist/module/RealtimeChannel";
import { useEffect, useState } from "react";
import { calcRanking, sortByScore } from "@/app/_utils/ranking";
import supabase from "@/utils/supabase/supabase";

export default function useTeamRanking({
  serverTeams,
}: {
  serverTeams: Team[];
}) {
  const [teams, setTeams] = useState<TeamWithRank[]>([]);

  useEffect(() => {
    setTeams(calcRanking(sortByScore(serverTeams), []));
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
            const updatedTeams = [
              payload.new,
              ...currentTeams.filter((team) => team.id !== payload.new.id),
            ];
            const sortedTeams = sortByScore(updatedTeams);

            return calcRanking(sortedTeams, teams);
          });
        },
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(channel);
    };
  }, [serverTeams, teams]);

  return teams;
}
