export interface PlayerStats {
  playerId: string;
  name: string;
  lastName: string;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  avgPoints: number;
  winRate: number;
  goalsScored: number;
  avgGoalsScored: number;
  goalsConceded: number;
  avgGoalsConceded: number;
  goalDifference: number;
}
