import { getTeamsByNameAsc } from "@/app/actions";
import ScoreUpdater from "@/app/admin/_components/ScoreUpdater";

export default async function Admin() {
  const teams = await getTeamsByNameAsc();

  return (
    <main className="space-y-4 p-10 font-sans font-semibold">
      <ScoreUpdater teams={teams} />
    </main>
  );
}
