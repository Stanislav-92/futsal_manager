import type { Match } from '@/pages/dashboard/types/match.types';
import type { MatchChartData } from '../types/playerMatchChartData.types';

export const calculatePlayerChartData = (playerId: string, matches: Match[]): MatchChartData[] => {
  const completedMatches = matches
    .filter(
      (match) =>
        match.status === 'completed' && match.playerSnapshots.some((s) => s.id === playerId),
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  let wins = 0;
  let totalGoals = 0;

  return completedMatches.map((match, index) => {
    const isPlayerInTeamA = match.teamA.includes(playerId);
    const goalsScored = isPlayerInTeamA ? match.result!.scoreA : match.result!.scoreB;
    const goalsConceded = isPlayerInTeamA ? match.result!.scoreB : match.result!.scoreA;

    if (goalsScored > goalsConceded) wins++;
    totalGoals += goalsScored;

    const matchNumber = index + 1;

    return {
      matchIndex: matchNumber,
      goalsScored,
      goalsConceded,
      cumulativeAvgGoals: Math.round((totalGoals / matchNumber) * 100) / 100,
      cumulativeWinRate: parseFloat(((wins / matchNumber) * 100).toFixed(1)),
    };
  });
};
