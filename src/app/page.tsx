import Image from "next/image";
import RankingList from "./_components/RankingList";
import { getScoreUpdates, getTeamsByRankAsc } from "./actions";
import ScoreLogs from "@/app/_components/ScoreLogs";

export default async function Home() {
  const teams = await getTeamsByRankAsc();
  const scoreUpdates = await getScoreUpdates();

  return (
    <main className="grid h-full w-full grid-rows-[1fr_5fr] overflow-hidden bg-gray-700 bg-linear-120 from-slate-900 to-violet-800/30 to-90% px-9 pb-8">
      <header className="flex items-center justify-center pt-10 pb-8 opacity-95">
        <Image src="/logo.png" alt="logo" width={396} height={63} priority />
      </header>
      <section className="grid w-full grid-cols-[2fr_1fr] gap-4">
        <RankingList teams={teams} />
        <ScoreLogs scoreUpdates={scoreUpdates} />
      </section>
    </main>
  );
}
