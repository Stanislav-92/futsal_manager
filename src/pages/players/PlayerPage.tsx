import { useNavigate, useParams } from 'react-router-dom';
import { useMatches } from '../dashboard/hooks/matches.queries';
import { usePlayers } from '../contacts/hooks/players.queries';
import { useMemo } from 'react';
import { calculatePlayerStats } from '../statistics/utils/playerStats.utils';
import { calculatePlayerChartData } from './utils/playerCharts.utils';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { Alert, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayerCharts from './components/PlayerCharts';
import PlayerStatsSummary from './components/PlayerStatsSummary';
import { useTranslation } from 'react-i18next';

export default function PlayerPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: matches = [], isLoading: isMatchesLoading } = useMatches();
  const { data: players = [], isLoading: isPlayersLoading } = usePlayers();

  const player = players.find((player) => player.id === id);

  const playerStats = useMemo(() => {
    if (!player) return null;
    const allStats = calculatePlayerStats(players, matches);
    return allStats.find((s) => s.playerId === id) ?? null;
  }, [players, matches, player, id]);

  const chartData = useMemo(() => {
    if (!id) return [];
    return calculatePlayerChartData(id, matches);
  }, [id, matches]);

  if (isMatchesLoading || isPlayersLoading) return <LoadingSpinner />;
  if (!player) return <Alert severity="error">{t('playerPage.notFound')}</Alert>;
  if (!playerStats) return <Alert severity="error">{t('playerPage.noStats')}</Alert>;

  return (
    <Box sx={{ width: '90%', mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        {t('common.back')}
      </Button>

      <PlayerStatsSummary
        playerStats={playerStats}
        playerName={`${player.name} ${player.lastName}`}
      />

      <PlayerCharts chartData={chartData} playerStats={playerStats} />
    </Box>
  );
}
