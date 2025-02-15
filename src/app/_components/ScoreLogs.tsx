import type { ScoreUpdate } from "@/app/types";
import { cn } from "@/lib/utils";

export default function ScoreLogs({
  scoreUpdates,
}: {
  scoreUpdates: ScoreUpdate[];
}) {
  return (
    <section className="h-full">
      <ul>
        {scoreUpdates?.map((log) => (
          <li key={log.id} className="flex">
            <div>{log.team_name}</div>

            <div>{log.game_type}</div>

            <div
              className={cn(
                "pr-0.5",
                log.score_change > 0 ? "text-green-300" : "text-red-300",
              )}
            >
              {log.score_change > 0 ? "+" : ""}
              {log.score_change}
            </div>

            <div>{log.created_at}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
