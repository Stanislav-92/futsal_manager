import type { PlayerStats } from '@/pages/statistics/types/playerStats.types';
import { PLAYER_STATS_ROWS } from '../constants/playerStatsRows.constants';
import { Box, Divider, Typography } from '@mui/material';
import { formatCellValue } from '@/shared/utils/formatCellValue.utils';

interface PlayerStatsSummaryProps {
  playerStats: PlayerStats;
  playerName: string;
}

export default function PlayerStatsSummary({ playerStats, playerName }: PlayerStatsSummaryProps) {
  const statsRows = PLAYER_STATS_ROWS;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
      <Typography variant="h5" sx={{ minWidth: 'max-content', mr: 2 }}>
        {playerName}
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        {statsRows.map((row, index) => (
          <Box key={row.key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              {row.label}:
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatCellValue(row.key, playerStats[row.key as keyof PlayerStats] as number)}
            </Typography>
            {index < PLAYER_STATS_ROWS.length - 1 && <Divider orientation="vertical" flexItem />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
