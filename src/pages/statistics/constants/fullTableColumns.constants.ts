import type { PlayerStats } from '../types/playerStats.types';

export type FullTableColumnKey = keyof PlayerStats | 'name';

export interface FullTableColumnDef {
  key: FullTableColumnKey;
  labelKey: string;
  tooltipKey?: string;
  sortable: boolean;
}

export const FULL_TABLE_COLUMNS: FullTableColumnDef[] = [
  { key: 'name', labelKey: 'fullTable.player', sortable: false },
  { key: 'matches', labelKey: 'fullTable.mp', tooltipKey: 'fullTable.tooltipMp', sortable: true },
  { key: 'wins', labelKey: 'fullTable.w', tooltipKey: 'fullTable.tooltipW', sortable: true },
  { key: 'losses', labelKey: 'fullTable.l', tooltipKey: 'fullTable.tooltipL', sortable: true },
  { key: 'draws', labelKey: 'fullTable.d', tooltipKey: 'fullTable.tooltipD', sortable: true },
  { key: 'points', labelKey: 'fullTable.pts', tooltipKey: 'fullTable.tooltipPts', sortable: true },
  {
    key: 'avgPoints',
    labelKey: 'fullTable.ptsPerGame',
    tooltipKey: 'fullTable.tooltipPtsPerGame',
    sortable: true,
  },
  {
    key: 'winRate',
    labelKey: 'fullTable.winPercent',
    tooltipKey: 'fullTable.tooltipWinPercent',
    sortable: true,
  },
  {
    key: 'goalsScored',
    labelKey: 'fullTable.gs',
    tooltipKey: 'fullTable.tooltipGs',
    sortable: true,
  },
  {
    key: 'avgGoalsScored',
    labelKey: 'fullTable.gsPerGame',
    tooltipKey: 'fullTable.tooltipGsPerGame',
    sortable: true,
  },
  {
    key: 'goalsConceded',
    labelKey: 'fullTable.gc',
    tooltipKey: 'fullTable.tooltipGc',
    sortable: true,
  },
  {
    key: 'avgGoalsConceded',
    labelKey: 'fullTable.gcPerGame',
    tooltipKey: 'fullTable.tooltipGcPerGame',
    sortable: true,
  },
  {
    key: 'goalDifference',
    labelKey: 'fullTable.gd',
    tooltipKey: 'fullTable.tooltipGd',
    sortable: true,
  },
];
