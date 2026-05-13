import { Grid } from '@mui/material';
import LeaderboardBlock from './LeaderboardBlock';
import type { PlayerStats } from '../types/playerStats.types';

interface LeaderboardsTabProps {
  stats: PlayerStats[];
  activePlayerIds: string[];
}

const gridSize = { xs: 12, sm: 6, md: 4 };

export default function LeaderboardsTab({ stats, activePlayerIds }: LeaderboardsTabProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Win Rate"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.winRate}
          formatValue={(value) => `${value.toFixed(1)}%`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Wins"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.wins}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Average Points"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.avgPoints}
          formatValue={(value) => value.toFixed(2)}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Draws"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.draws}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Losses"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.losses}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Matches"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.matches}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Goal Difference"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.goalDifference}
          formatValue={(value) => `${value}`}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Average Goals Scored"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.avgGoalsScored}
          formatValue={(value) => value.toFixed(2)}
        />
      </Grid>
      <Grid size={gridSize}>
        <LeaderboardBlock
          title="Average Goals Conceded"
          stats={stats}
          activePlayerIds={activePlayerIds}
          getValue={(stat) => stat.avgGoalsConceded}
          formatValue={(value) => value.toFixed(2)}
        />
      </Grid>
    </Grid>
  );
}
