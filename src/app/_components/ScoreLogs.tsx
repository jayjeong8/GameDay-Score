"use client";

import type { ScoreUpdate } from "@/app/types";
import useScoreUpdates from "@/app/_hooks/useScoreUpdates";
import { formatTime } from "@/app/_utils/text";
import { cn } from "@/lib/utils";

export default function ScoreLogs({
  serverUpdates,
}: {
  serverUpdates: ScoreUpdate[];
}) {
  const scoreUpdates = useScoreUpdates({ serverUpdates });

  return (
    <section
      className={cn(
        "rounded-md border border-cyan-400/20 p-8 text-2xl text-slate-100/80",
        "bg-slate-900/90 bg-linear-to-b from-pink-500/10 to-cyan-800/20 to-50% shadow-[inset_0_20px_20px_-18px_rgba(255,255,255,0.2)] drop-shadow-md",
      )}
    >
      <ul className="divide-y">
        {scoreUpdates?.map((log, index) => (
          <li
            key={log.id}
            className="grid grid-cols-[auto_1fr_4fr_4fr] items-center border-cyan-400/20 px-2 py-2"
            style={{ opacity: Math.max(1 - index * 0.08, 0.5) }}
          >
            <div className="pr-4 font-sans text-xs opacity-60">
              {formatTime(log.created_at)}
            </div>

            <div className="justify-self-end break-keep">{log.team_name}</div>

            <div className="ml-8 text-xl break-keep">{log.game_type}</div>

            <div
              className={cn(
                "justify-self-end tracking-tighter tabular-nums",
                log.score_change > 0 ? "text-green-300" : "text-red-300",
              )}
            >
              <span className="mr-1">{log.score_change > 0 ? "+" : "-"}</span>
              {Math.abs(log.score_change)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
