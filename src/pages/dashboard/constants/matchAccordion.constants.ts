import type { MatchStatus } from '../types/match.types';

export const STATUS_CONFIG: Record<
  MatchStatus,
  { labelKey: string; color: 'info' | 'warning' | 'success' }
> = {
  open: { labelKey: 'match.statusOpen', color: 'info' },
  in_progress: { labelKey: 'match.statusInProgress', color: 'warning' },
  completed: { labelKey: 'match.statusCompleted', color: 'success' },
};
