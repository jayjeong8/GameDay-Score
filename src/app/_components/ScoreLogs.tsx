import type { ScoreUpdate } from "@/app/types";
import { cn } from "@/lib/utils";

export default function ScoreLogs({
  scoreUpdates,
}: {
  scoreUpdates: ScoreUpdate[];
}) {
  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(date));
  };

  return (
    <section
      className={cn(
        "h-[84vh] rounded-md p-8 text-2xl text-slate-100/80",
        "bg-slate-900/90 bg-linear-to-b from-pink-500/10 to-cyan-800/20 to-50% shadow-[inset_0_20px_20px_-18px_rgba(255,255,255,0.2)] drop-shadow-md",
      )}
    >
      <ul className="h-full max-h-full space-y-2 overflow-y-auto">
        {scoreUpdates?.map((log, index) => (
          <li
            key={log.id}
            className="grid grid-cols-[1fr_5fr_2fr_auto]"
            style={{ opacity: Math.max(1 - index * 0.08, 0.5) }}
          >
            <div className="justify-self-end">{log.team_name}</div>

            <div className="ml-8">{log.game_type}</div>

            <div
              className={cn(
                "justify-self-end pr-8 tracking-tighter tabular-nums",
                log.score_change > 0 ? "text-green-300" : "text-red-300",
              )}
            >
              <span className="mr-1">{log.score_change > 0 ? "+" : ""}</span>
              {log.score_change}
            </div>

            <div className="flex items-center pr-1 font-sans text-base opacity-60">
              {formatTime(log.created_at)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
