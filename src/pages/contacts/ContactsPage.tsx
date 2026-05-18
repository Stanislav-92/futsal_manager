import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayersTable from './components/PlayersTable';
import { useAddPlayer, usePlayers } from './hooks/players.queries';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { useState } from 'react';
import PlayerFormDialog from './components/PlayerFormDialog';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/shared/components/Toast';
import type { PlayerContact } from './types/player.types';
import { useTranslation } from 'react-i18next';

export default function ContactsPage() {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: players = [], isLoading, isError } = usePlayers();
  const { mutate: addPlayer, isPending } = useAddPlayer();

  const { toast, showToast, hideToast } = useToast();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Alert severity="error">{t('contacts.loadError')}</Alert>;

  const handleAddPlayer = (data: Omit<PlayerContact, 'id' | 'matches'>) => {
    addPlayer(
      { ...data, matches: 0 },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          showToast(t('contacts.addSuccess'));
        },
        onError: (error) => {
          showToast(error.message, 'error');
        },
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
            {t('contacts.title')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('contacts.subtitle')}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          {t('contacts.addPlayer')}
        </Button>
      </Stack>

      <PlayersTable players={players} />

      <PlayerFormDialog
        key={isAddDialogOpen ? 'open' : 'closed'}
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddPlayer}
        isPending={isPending}
        title={t('contacts.addPlayer')}
        submitLabel={t('common.save')}
      />

      {toast && <Toast message={toast.message} severity={toast.severity} onClose={hideToast} />}
    </Box>
  );
}
