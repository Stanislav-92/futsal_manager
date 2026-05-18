import type { TeamBalanceMode } from '../types/teamBalanceMode.types';

export const TEAM_BALANCE_OPTIONS: {
  value: TeamBalanceMode;
  labelKey: string;
  tooltipKey: string;
}[] = [
  {
    value: 'powerIndex',
    labelKey: 'teamBalance.powerIndex',
    tooltipKey: 'teamBalance.powerIndexTooltip',
  },
  {
    value: 'winRate',
    labelKey: 'teamBalance.winRate',
    tooltipKey: 'teamBalance.winRateTooltip',
  },
  {
    value: 'random',
    labelKey: 'teamBalance.random',
    tooltipKey: 'teamBalance.randomTooltip',
  },
];
