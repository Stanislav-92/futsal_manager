import { Alert, Box, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useMatches } from '../dashboard/hooks/matches.queries';
import { usePlayers } from '../contacts/hooks/players.queries';
import { calculatePlayerStats } from './utils/playerStats.utils';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import LeaderboardsTab from './components/LeaderboardsTab';
import FullTableTab from './components/FullTableTab';

type StatisticsTab = 'leaderboards' | 'table';

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<StatisticsTab>('leaderboards');

  const { data: matches = [], isLoading: isMatchesLoading, isError: isMatchesError } = useMatches();
  const { data: players = [], isLoading: isPlayersLoading, isError: isPlayersError } = usePlayers();

  const playerStats = useMemo(() => calculatePlayerStats(players, matches), [players, matches]);

  const activePlayerIds = players.map((player) => player.id);

  if (isMatchesLoading || isPlayersLoading) return <LoadingSpinner />;
  if (isMatchesError || isPlayersError)
    return <Alert severity="error">Failed to load statistics</Alert>;

  return (
    <Box sx={{ width: '90%', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Statistics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Player performance overview
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Leaderboards" value="leaderboards" />
        <Tab label="Full table" value="table" />
      </Tabs>

      {activeTab === 'leaderboards' && (
        <LeaderboardsTab stats={playerStats} activePlayerIds={activePlayerIds} />
      )}

      {activeTab === 'table' && (
        <FullTableTab stats={playerStats} activePlayerIds={activePlayerIds} />
      )}
    </Box>
  );
}
