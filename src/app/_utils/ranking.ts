import type { Team, TeamWithRank } from "@/app/types";

export const sortByScore = (teams: Team[]) =>
  teams.toSorted((a, b) => {
    if (a.total_score === b.total_score) {
      return a.team_name.localeCompare(b.team_name);
    }

    return b.total_score - a.total_score;
  });

export const calcRanking = (
  sortedTeams: Team[],
  oldTeams: TeamWithRank[],
): TeamWithRank[] => {
  let prevNewTeam: TeamWithRank | null = null;

  return sortedTeams.map((team, index) => {
    const rank =
      prevNewTeam?.total_score === team.total_score
        ? prevNewTeam.rank
        : index + 1;

    const oldTeam = oldTeams.find((oldTeam) => oldTeam.id === team.id);
    const rankDiff = oldTeam ? oldTeam.rank - rank : 0;

    const newTeam: TeamWithRank = {
      ...team,
      rank,
      rank_diff: rankDiff,
    };
    prevNewTeam = newTeam;

    return newTeam;
  });
};
