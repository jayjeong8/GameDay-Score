import Image from "next/image";
import RankingList from "./_components/RankingList";
import { getTeams } from "./actions";

export default async function Home() {
  const teams = await getTeams();

  return (
    <main className="h-full w-full overflow-x-hidden bg-gray-700 bg-linear-120 from-slate-900 to-violet-800/30 to-90% px-5">
      <header className="flex items-center justify-center pt-10 pb-4 opacity-95">
        <Image src="/logo.png" alt="logo" width={396} height={63} priority />
      </header>
      <RankingList teams={teams} />
    </main>
  );
}
