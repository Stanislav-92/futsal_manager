import type { PlayerContact } from '@/pages/contacts/types/player.types';
import type { Match } from '../types/match.types';
import { useState } from 'react';
import { Autocomplete, Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { useTranslation } from 'react-i18next';

interface MatchAccordionOpenProps {
  match: Match;
  players: PlayerContact[];
  isPending: boolean;
  isDeleting: boolean;
  onAddPlayer: (playerId: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onStartMatch: () => void;
  onCancelConfirm: () => void;
}

export default function MatchAccordionOpen({
  match,
  players,
  isPending,
  isDeleting,
  onAddPlayer,
  onRemovePlayer,
  onStartMatch,
  onCancelConfirm,
}: MatchAccordionOpenProps) {
  const { t } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const availablePlayers = players.filter(
    (player) => !match.playerSnapshots.some((s) => s.id === player.id),
  );

  const canStart = match.playerSnapshots.length >= 8 && match.playerSnapshots.length <= 12;

  const handleAddPlayer = () => {
    if (!selectedPlayerId) return;
    onAddPlayer(selectedPlayerId);
    setSelectedPlayerId('');
  };

  const handleRemovePlayer = (playerId: string) => {
    onRemovePlayer(playerId);
  };

  const handleCancelConfirm = () => {
    onCancelConfirm();
    setIsCancelDialogOpen(false);
  };

  return (
    <>
      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {t('match.playersMin', { count: match.playerSnapshots.length })}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          {match.playerSnapshots.map((player) => (
            <Chip
              key={player.id}
              label={`${player.name} ${player.lastName}`}
              onDelete={() => handleRemovePlayer(player.id)}
              size="small"
            />
          ))}
        </Stack>

        {match.playerSnapshots.length < 12 && availablePlayers.length > 0 && (
          <Stack direction="row" gap={4} sx={{ mb: 2 }}>
            <Autocomplete
              options={availablePlayers}
              getOptionLabel={(player) => `${player.name} ${player.lastName}`}
              value={availablePlayers.find((player) => player.id === selectedPlayerId) ?? null}
              onChange={(_, player) => setSelectedPlayerId(player?.id ?? '')}
              size="small"
              sx={{ width: '50%' }}
              renderInput={(params) => (
                <TextField {...params} placeholder={t('match.selectPlayer')} />
              )}
            />
            <Button
              variant="contained"
              onClick={handleAddPlayer}
              disabled={!selectedPlayerId || isPending}
            >
              {t('common.add')}
            </Button>
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => setIsCancelDialogOpen(true)}
            disabled={isDeleting}
          >
            {t('match.cancelMatch')}
          </Button>
          <Button
            variant="contained"
            size="medium"
            disabled={!canStart || isPending || isDeleting}
            onClick={onStartMatch}
          >
            {canStart ? t('match.startMatch') : t('match.startMatchMin')}
          </Button>
        </Stack>
      </Box>

      <ConfirmDialog
        open={isCancelDialogOpen}
        title={t('match.cancelConfirmTitle')}
        message={t('match.cancelConfirmMessage')}
        confirmLabel={t('common.confirm')}
        isPending={isDeleting}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
}
