import Image from "next/image";
import RankingList from "./_components/RankingList";
import { getScoreUpdates, getTeamsByRankAsc } from "./actions";
import ScoreLogs from "@/app/_components/ScoreLogs";

export const revalidate = 0;

export default async function Home() {
  const teams = await getTeamsByRankAsc();
  const scoreUpdates = await getScoreUpdates();

  return (
    <main className="h-full w-full overflow-hidden bg-gray-700 bg-linear-120 from-slate-900 via-slate-900 to-violet-800/30 to-100% px-64 pb-8">
      <header className="flex items-center justify-center pt-20 pb-14 opacity-95">
        <Image
          src="/logo.png"
          alt="logo"
          width={396}
          height={63}
          priority
          className="animate-duration-[2500ms] animate-ease-in animate-bounce"
        />
      </header>
      <section className="grid h-fit w-full grid-cols-[2fr_1.2fr] gap-4">
        <RankingList serverTeams={teams} />
        <ScoreLogs serverUpdates={scoreUpdates} />
      </section>
    </main>
  );
}
