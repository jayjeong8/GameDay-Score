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
      <h1 className="mb-10 text-2xl font-bold">팀 랭킹</h1>
      <div className="space-y-2">
        {teams?.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">#{team.rank}</span>
                {team.rank_diff !== 0 && (
                  <span
                    className={
                      team.rank_diff > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    ({team.rank_diff > 0 ? "+" : ""}
                    {team.rank_diff})
                  </span>
                )}
                <span className="text-lg">{team.team_name}</span>
              </div>
              <div className="text-sm text-gray-600">
                점수: {team.total_score}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedTeam(team);
                setIsModalOpen(true);
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        ))}
      </div>

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
