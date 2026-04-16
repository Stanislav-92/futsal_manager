export type MatchStatus = 'open' | 'in_progress' | 'completed';

export interface PlayerSnapshot {
  id: string;
  name: string;
  lastName: string;
}

export interface Match {
  id: string;
  date: string;
  status: MatchStatus;
  playerSnapshots: PlayerSnapshot[];
  teamA: string[];
  teamB: string[];
  result?: {
    scoreA: number;
    scoreB: number;
  };
}
