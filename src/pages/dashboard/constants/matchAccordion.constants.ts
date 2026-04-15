import type { MatchStatus } from '../types/match.types';

export const STATUS_CONFIG: Record<
  MatchStatus,
  { label: string; color: 'info' | 'warning' | 'success' }
> = {
  open: { label: 'Open', color: 'info' },
  in_progress: { label: 'In progress', color: 'warning' },
  completed: { label: 'Completed', color: 'success' },
};
