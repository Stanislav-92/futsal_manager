import { Alert, Box, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useMatches } from '../dashboard/hooks/matches.queries';
import { usePlayers } from '../contacts/hooks/players.queries';
import { calculatePlayerStats } from './utils/playerStats.utils';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import LeaderboardsTab from './components/LeaderboardsTab';
import FullTableTab from './components/FullTableTab';
import { useTranslation } from 'react-i18next';

type StatisticsTab = 'leaderboards' | 'table';

export default function StatisticsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<StatisticsTab>('leaderboards');

  const { data: matches = [], isLoading: isMatchesLoading, isError: isMatchesError } = useMatches();
  const { data: players = [], isLoading: isPlayersLoading, isError: isPlayersError } = usePlayers();

  const playerStats = useMemo(() => calculatePlayerStats(players, matches), [players, matches]);

  const activePlayerIds = players.map((player) => player.id);

  if (isMatchesLoading || isPlayersLoading) return <LoadingSpinner />;
  if (isMatchesError || isPlayersError)
    return <Alert severity="error">{t('statistics.loadError')}</Alert>;

  return (
    <Box sx={{ width: '90%', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {t('statistics.title')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('statistics.subtitle')}
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={t('statistics.leaderboards')} value="leaderboards" />
        <Tab label={t('statistics.fullTable')} value="table" />
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
