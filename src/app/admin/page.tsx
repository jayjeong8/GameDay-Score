import { redirect } from "next/navigation";
import { getTeamsByNameAsc } from "@/app/actions";
import ScoreUpdater from "@/app/admin/_components/ScoreUpdater";

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ adminKey: string }>;
}) {
  const { adminKey } = await searchParams;

  const validateAdminKey = (adminKey?: string) => {
    if (!adminKey) return false;

    const validKey = process.env.ADMIN_KEY;
    if (!validKey) return false;

    return adminKey === validKey;
  };

  const isValidKey = validateAdminKey(adminKey);

  if (!isValidKey) {
    redirect("/");
  }

  const teams = await getTeamsByNameAsc();

  return (
    <main className="space-y-4 p-10 font-sans font-semibold">
      <ScoreUpdater teams={teams} />
    </main>
  );
}
