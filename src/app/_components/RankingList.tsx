"use client";

import type { Team } from "@/app/types";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { updateTeamScore } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function RankingList({ teams }: { teams: Team[] }) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoreChange, setScoreChange] = useState("");
  const [gameType, setGameType] = useState("");

  const handleScoreUpdate = async () => {
    if (!selectedTeam) return;

    try {
      await updateTeamScore(selectedTeam.id, parseInt(scoreChange), gameType);

      setIsModalOpen(false);
      setScoreChange("");
      setGameType("");
    } catch (error) {
      console.error("Failed to update score:", error);
    }
  };

  return (
    <div className="p-4">
      <ul className="space-y-2 font-semibold">
        {teams?.map((team) => (
          <li
            key={team.id}
            className={cn(
              "flex items-center rounded-lg p-4",
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

            <div className="flex grow justify-end px-5 text-5xl tracking-tighter text-pink-400 tabular-nums">
              {team.total_score}
            </div>

            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                setSelectedTeam(team);
                setIsModalOpen(true);
              }}
              className="group ml-auto w-12 cursor-pointer hover:bg-slate-50/0"
            >
              <ChevronRight className="size-8 stroke-slate-400/50 group-hover:stroke-slate-300" />
            </Button>
          </li>
        ))}
      </ul>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>점수 업데이트 - {selectedTeam?.team_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">점수 변경</label>
              <Input
                type="number"
                value={scoreChange}
                onChange={(e) => setScoreChange(e.target.value)}
                placeholder="변경할 점수 입력 (음수 가능)"
              />
            </div>
            <div>
              <label className="text-sm font-medium">게임 타입</label>
              <Input
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
                placeholder="게임 이름 입력"
              />
            </div>
            <Button onClick={handleScoreUpdate}>업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
