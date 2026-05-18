import type { PlayerStats } from '@/pages/statistics/types/playerStats.types';

export const PLAYER_STATS_ROWS: { labelKey: string; key: keyof PlayerStats }[] = [
  { labelKey: 'playerPage.matchesPlayed', key: 'matches' },
  { labelKey: 'playerPage.winRate', key: 'winRate' },
  { labelKey: 'playerPage.wins', key: 'wins' },
  { labelKey: 'playerPage.draws', key: 'draws' },
  { labelKey: 'playerPage.losses', key: 'losses' },
  { labelKey: 'playerPage.points', key: 'points' },
  { labelKey: 'playerPage.avgPoints', key: 'avgPoints' },
  { labelKey: 'playerPage.goalsScored', key: 'goalsScored' },
  { labelKey: 'playerPage.avgGoalsScored', key: 'avgGoalsScored' },
  { labelKey: 'playerPage.goalsConceded', key: 'goalsConceded' },
  { labelKey: 'playerPage.avgGoalsConceded', key: 'avgGoalsConceded' },
  { labelKey: 'playerPage.goalDifference', key: 'goalDifference' },
];
