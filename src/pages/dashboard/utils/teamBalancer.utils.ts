import type { PlayerStats } from '@/pages/statistics/types/playerStats.types';
import type { PlayerSnapshot } from '../types/match.types';
import type { TeamBalanceMode } from '../types/teamBalanceMode.types';

const MIN_MATCHES = 2;
const NEUTRAL_RATING = 0.33;

export interface PlayerRating {
  playerId: string;
  rating: number;
  hasEnoughMatches: boolean;
}

export interface BalanceTeamsResult {
  teamA: string[];
  teamB: string[];
  playerRatings?: PlayerRating[];
}

const normalizeValues = (values: number[]): number[] => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => NEUTRAL_RATING);
  return values.map((value) => (value - min) / (max - min));
};

const snakeDraft = (players: PlayerRating[]): { teamA: string[]; teamB: string[] } => {
  const sorted = [...players].sort((a, b) => b.rating - a.rating);
  const teamA: string[] = [];
  const teamB: string[] = [];

  sorted.forEach((player, index) => {
    const slot = index % 4;
    if (slot == 0 || slot === 3) teamA.push(player.playerId);
    else teamB.push(player.playerId);
  });

  return { teamA, teamB };
};

export const balanceTeams = (
  playerSnapshots: PlayerSnapshot[],
  allStats: PlayerStats[],
  mode: TeamBalanceMode,
): BalanceTeamsResult => {
  if (mode === 'random') {
    const shuffled = [...playerSnapshots.map((p) => p.id)].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    return { teamA: shuffled.slice(0, mid), teamB: shuffled.slice(mid) };
  }

  const goalDiffs = playerSnapshots.map((player) => {
    const playerStats = allStats.find((stat) => stat.playerId === player.id);
    return playerStats ? playerStats.goalDifference : 0;
  });
  const normalizedDiffs = normalizeValues(goalDiffs);

  const playersWithRating: PlayerRating[] = playerSnapshots.map((player, index) => {
    const playerStats = allStats.find((stat) => stat.playerId === player.id);

    if (!playerStats || playerStats.matches < MIN_MATCHES) {
      return { playerId: player.id, rating: NEUTRAL_RATING, hasEnoughMatches: false };
    }

    if (mode === 'winRate') {
      return { playerId: player.id, rating: playerStats.winRate / 100, hasEnoughMatches: true };
    }

    const normalizedGoalDiff = normalizedDiffs[index];
    const powerIndex =
      (playerStats.winRate / 100) * 0.4 +
      (playerStats.avgPoints / 3) * 0.4 +
      normalizedGoalDiff * 0.2;

    return { playerId: player.id, rating: powerIndex, hasEnoughMatches: true };
  });

  const { teamA, teamB } = snakeDraft(playersWithRating);
  return { teamA, teamB, playerRatings: playersWithRating };
};

export const formatRating = (rating: PlayerRating, mode: TeamBalanceMode): string => {
  if (mode === 'winRate') return `${(rating.rating * 100).toFixed(1)}%`;
  return rating.rating.toFixed(2);
};

export const calculateAvgRating = (
  teamIds: string[],
  playerRatings: PlayerRating[],
  mode: TeamBalanceMode,
): string => {
  const ratings = teamIds
    .map((id) => playerRatings.find((rating) => rating.playerId === id))
    .filter((rating): rating is PlayerRating => rating !== undefined)
    .map((rating) => rating.rating);

  if (ratings.length === 0) return 'N/A';

  const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  if (mode === 'winRate') return `${(avg * 100).toFixed(1)}%`;
  return avg.toFixed(2);
};
