import type { ScoreUpdate } from "@/app/types";
import type { RealtimePostgresInsertPayload } from "@supabase/realtime-js/src/RealtimeChannel";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase/supabase";

export default function useScoreUpdates({
  serverUpdates,
}: {
  serverUpdates: ScoreUpdate[];
}) {
  const [scoreUpdates, setScoreUpdates] = useState(serverUpdates);

  useEffect(() => {
    setScoreUpdates(serverUpdates);
  }, [serverUpdates]);

  useEffect(() => {
    const channel = supabase
      .channel("score-logs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "score_updates",
        },
        (payload: RealtimePostgresInsertPayload<ScoreUpdate>) => {
          setScoreUpdates((current) => [payload.new, ...current.slice(0, -1)]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return scoreUpdates;
}
