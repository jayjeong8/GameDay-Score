import { getTeams } from './actions';
import RankingList from './_components/RankingList';

export default async function Home() {
  const teams = await getTeams();

  return (
    <main>
      <RankingList teams={teams} />
    </main>
  );
}