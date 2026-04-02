import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayersTable from './components/PlayersTable';
import { useAddPlayer, usePlayers } from './hooks/players.queries';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { useState } from 'react';
import PlayerFormDialog from './components/PlayerFormDialog';

export default function ContactsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: players = [], isLoading, isError } = usePlayers();
  const { mutate: addPlayer, isPending } = useAddPlayer();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Alert severity="error">Failed to load players</Alert>;

  return (
    <Box sx={{ maxWidth: '90%', mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Players
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage player contacts
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add player
        </Button>
      </Stack>

      <PlayersTable players={players} />

      <PlayerFormDialog
        key={isAddDialogOpen ? 'open' : 'closed'}
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={(data) =>
          addPlayer(
            { ...data, matches: 0 },
            {
              onSuccess: () => setIsAddDialogOpen(false),
            },
          )
        }
        isPending={isPending}
        title="Add player"
        submitLabel="Save"
      />
    </Box>
  );
}
