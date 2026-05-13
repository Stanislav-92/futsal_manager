import type { TeamBalanceMode } from '../types/teamBalanceMode.types';

export const TEAM_BALANCE_OPTIONS: { value: TeamBalanceMode; label: string; tooltip: string }[] = [
  {
    value: 'powerIndex',
    label: 'Power Index',
    tooltip:
      'Balances teams based on win rate (40%), average points (40%), and goal difference (20%).',
  },
  {
    value: 'winRate',
    label: 'Win Rate',
    tooltip: 'Balances teams purely based on win percentage.',
  },
  {
    value: 'random',
    label: 'Random',
    tooltip: 'Randomly assigns players to teams.',
  },
];
