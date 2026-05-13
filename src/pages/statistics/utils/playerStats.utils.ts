import type { PlayerContact } from '@/pages/contacts/types/player.types';
import type { Match } from '@/pages/dashboard/types/match.types';
import type { PlayerStats } from '../types/playerStats.types';

export const calculatePlayerStats = (players: PlayerContact[], matches: Match[]): PlayerStats[] => {
  const completedMatches = matches.filter((match) => match.status === 'completed');

  return players.map((player) => {
    const playerMatches = completedMatches.filter((match) =>
      match.playerSnapshots.some((s) => s.id === player.id),
    );

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let goalsScored = 0;
    let goalsConceded = 0;

    playerMatches.forEach((match) => {
      const isPlayerInTeamA = match.teamA.includes(player.id);

      const playerGoals = isPlayerInTeamA ? match.result!.scoreA : match.result!.scoreB;
      const opponentGoals = isPlayerInTeamA ? match.result!.scoreB : match.result!.scoreA;

      goalsScored += playerGoals;
      goalsConceded += opponentGoals;

      if (playerGoals > opponentGoals) wins++;
      else if (playerGoals < opponentGoals) losses++;
      else draws++;
    });

    const matchCount = playerMatches.length;
    const points = wins * 3 + draws * 1;

    return {
      playerId: player.id,
      name: player.name,
      lastName: player.lastName,
      matches: matchCount,
      wins,
      losses,
      draws,
      points,
      avgPoints: matchCount > 0 ? points / matchCount : 0,
      winRate: matchCount > 0 ? (wins / matchCount) * 100 : 0,
      goalsScored,
      avgGoalsScored: matchCount > 0 ? goalsScored / matchCount : 0,
      goalsConceded,
      avgGoalsConceded: matchCount > 0 ? goalsConceded / matchCount : 0,
      goalDifference: goalsScored - goalsConceded,
    };
  });
};
