import { Alert, Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import { useAddMatch, useMatches } from './hooks/matches.queries';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import MatchAccordion from './components/MatchAccodion';
import { useState } from 'react';
import CreateMatchDialog, { type CreateMatchFormData } from './components/CreateMatchDialog';
import { usePlayers } from '../contacts/hooks/players.queries';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/shared/components/Toast';
import { DATE_FORMAT } from '@/shared/constants/date.constants';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: matches = [], isLoading, isError } = useMatches();
  const { mutate: addMatch, isPending } = useAddMatch();
  const { data: players = [] } = usePlayers();

  const { toast, showToast, hideToast } = useToast();

  const activeMatch = matches.find(
    (match) => match.status === 'open' || match.status === 'in_progress',
  );

  const completedMatches = matches.filter((match) => match.status === 'completed');

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Alert severity="error">{t('dashboard.loadError')}</Alert>;

  const handleCreateMatch = (data: CreateMatchFormData) => {
    addMatch(
      {
        date: data.date ? data.date.format(DATE_FORMAT) : '',
        status: 'open',
        playerSnapshots: [],
        teamA: [],
        teamB: [],
      },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          showToast(t('dashboard.createSuccess'));
        },
        onError: () => showToast(t('dashboard.createError'), 'error'),
      },
    );
  };

  return (
    <Box sx={{ width: '90%', mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('dashboard.subtitle')}
          </Typography>
        </Box>

        <Tooltip title={activeMatch ? t('dashboard.finishActiveFirst') : ''}>
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={!!activeMatch}
            >
              {t('dashboard.createMatch')}
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {matches.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="textSecondary">
            {t('dashboard.noMatches')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('dashboard.noMatchesHint')}
          </Typography>
        </Box>
      )}

      {activeMatch && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 1, fontWeight: 500, ml: '16px' }}
          >
            {t('dashboard.active')}
          </Typography>
          <MatchAccordion
            matches={matches}
            match={activeMatch}
            players={players}
            onMatchUpdated={showToast}
          />
        </Box>
      )}

      {completedMatches.length > 0 && (
        <Box>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 1, fontWeight: 500, ml: '16px' }}
          >
            {t('dashboard.archive')}
          </Typography>
          <Stack spacing={1}>
            {completedMatches.map((match) => (
              <MatchAccordion
                key={match.id}
                matches={matches}
                match={match}
                players={players}
                onMatchUpdated={showToast}
              />
            ))}
          </Stack>
        </Box>
      )}

      <CreateMatchDialog
        key={isCreateDialogOpen ? 'open' : 'closed'}
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateMatch}
        isPending={isPending}
      />

      {toast && <Toast message={toast.message} severity={toast.severity} onClose={hideToast} />}
    </Box>
  );
}
