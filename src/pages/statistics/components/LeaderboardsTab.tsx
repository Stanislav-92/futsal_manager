import { Grid } from '@mui/material';
import LeaderboardBlock from './LeaderboardBlock';
import type { PlayerStats } from '../types/playerStats.types';
import { useTranslation } from 'react-i18next';

interface LeaderboardsTabProps {
  stats: PlayerStats[];
  activePlayerIds: string[];
}

const gridSize = { xs: 12, sm: 6, md: 4 };

export default function LeaderboardsTab({ stats, activePlayerIds }: LeaderboardsTabProps) {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.winRate')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.winRate}
          formatValue={(value) => `${value.toFixed(1)}%`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.wins')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.wins}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.avgPoints')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.avgPoints}
          formatValue={(value) => value.toFixed(2)}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.draws')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.draws}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.losses')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.losses}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.matches')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.matches}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.goalDifference')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.goalDifference}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.avgGoalsScored')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.avgGoalsScored}
          formatValue={(value) => value.toFixed(2)}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title={t('leaderboards.avgGoalsConceded')}
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.avgGoalsConceded}
          formatValue={(value) => value.toFixed(2)}
        />
      </Grid>
    </Grid>
  );
}
