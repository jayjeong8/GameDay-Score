"use client";

import type { Team } from "@/app/types";
import { useState } from "react";
import { updateTeamScore } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ScoreUpdater({ teams }: { teams: Team[] }) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [scoreChange, setScoreChange] = useState(0);
  const [gameType, setGameType] = useState("");
  const [customGameType, setCustomGameType] = useState("");

  const quickScoreButtons = [
    { value: 10, label: "+10" },
    { value: 20, label: "+20" },
    { value: 30, label: "+30" },
    { value: 50, label: "+50" },
    { value: 70, label: "+70" },
    { value: 100, label: "+100" },
  ];

  const handleQuickScore = (value: number) => {
    setScoreChange((prevScore) => prevScore + value);
  };

  const gameTypes = [
    "고리 던지기",
    "팽이 치기",
    "컬링",
    "컵탑 쌓기",
    "딱지 치기",
    "윷놀이",
    "custom",
  ];

  const handleGameTypeChange = (value: string) => {
    setGameType(value);

    if (value !== "custom") {
      setCustomGameType("");
    }
  };

  // 최종 게임 타입 값을 반환하는 함수
  const getFinalGameType = () => {
    if (gameType === "custom") {
      return customGameType;
    }

    return gameType;
  };

  const handleScoreUpdate = async () => {
    try {
      await updateTeamScore(
        Number(selectedTeamId),
        scoreChange,
        getFinalGameType(),
      );

      setSelectedTeamId("");
      setScoreChange(0);
      setGameType("");
    } catch (error) {
      console.error("Failed to update score:", error);
    }
  };

  return (
    <main className="space-y-12 p-10">
      <section>
        <label className="text-3xl font-light">조 선택</label>
        <RadioGroup
          value={selectedTeamId}
          onValueChange={(value) => setSelectedTeamId(value)}
          className="mt-4 grid grid-cols-4 gap-4"
        >
          {teams?.map((team) => (
            <div key={team.id} className="flex items-center space-x-2">
              <RadioGroupItem value={String(team.id)} id={String(team.id)} />
              <label htmlFor={String(team.id)} className="text-sm">
                {team.team_name}
              </label>
            </div>
          ))}
        </RadioGroup>
      </section>

      <section>
        <label className="text-3xl font-light">변경할 점수</label>
        <Input
          type="number"
          value={scoreChange}
          onChange={(e) => setScoreChange(Number(e.target.value))}
          placeholder="변경할 점수 입력 (음수 가능)"
          className="mt-4"
        />
        <div className="mt-2 flex gap-2">
          {quickScoreButtons.map((btn) => (
            <Button
              key={btn.value}
              onClick={() => handleQuickScore(btn.value)}
              variant="outline"
              className="flex-1"
            >
              {btn.label}
            </Button>
          ))}
          <Button
            onClick={() => setScoreChange((prev) => prev * -1)}
            variant="outline"
            className="flex-1"
          >
            음수
          </Button>
        </div>
      </section>

      <section>
        <label className="text-3xl font-light">게임 종류</label>
        <RadioGroup
          value={gameType}
          onValueChange={handleGameTypeChange}
          className="mt-4 grid grid-cols-4 gap-4"
        >
          {gameTypes.map((game) => (
            <div key={game} className="flex items-center space-x-2">
              <RadioGroupItem value={game} id={game} />
              <label htmlFor={game} className="text-sm">
                {game}
              </label>
            </div>
          ))}
        </RadioGroup>
        {gameType === "custom" && (
          <Input
            value={customGameType}
            onChange={(e) => setCustomGameType(e.target.value)}
            placeholder="게임 이름을 입력하세요"
            className="mt-2"
          />
        )}
      </section>

      <div className="mt-12 flex justify-end">
        <Button
          disabled={
            !selectedTeamId ||
            !scoreChange ||
            !gameType ||
            (gameType === "custom" && customGameType === "")
          }
          onClick={handleScoreUpdate}
          className="text-md bg-pink-500 px-6 py-7 disabled:bg-gray-400/50"
        >
          <span className="-ml-2 text-3xl font-bold">
            {
              teams?.find((team) => String(team.id) === selectedTeamId)
                ?.team_name
            }
          </span>
          점수 변경
        </Button>
      </div>
    </main>
  );
}
