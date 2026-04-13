import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Match, MatchStatus } from '../types/match.types';
import dayjs from 'dayjs';
import type { PlayerContact } from '@/pages/contacts/types/player.types';
import { useRef, useState } from 'react';
import { useDeleteMatch, useUpdateMatch } from '../hooks/matches.queries';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/shared/components/Toast';

interface MatchAccordionProps {
  match: Match;
  players: PlayerContact[];
  onMatchUpdated?: (message: string) => void;
}

const statusConfig: Record<MatchStatus, { label: string; color: 'info' | 'warning' | 'success' }> =
  {
    open: { label: 'Open', color: 'info' },
    in_progress: { label: 'In progress', color: 'warning' },
    completed: { label: 'Completed', color: 'success' },
  };

export default function MatchAccordion({ match, players, onMatchUpdated }: MatchAccordionProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [scoreA, setScoreA] = useState<number | null>(null);
  const [scoreB, setScoreB] = useState<number | null>(null);
  const [expanded, setIsExpanded] = useState(match.status === 'open');

  const { mutate: updateMatch, isPending } = useUpdateMatch();
  const { mutate: deleteMatch, isPending: isDeleting } = useDeleteMatch();

  const { toast, showToast, hideToast } = useToast();

  const accordionRef = useRef<HTMLDivElement>(null);

  const status = statusConfig[match.status];
  const teamsGenerated = match.teamA.length > 0;

  // Players not yet added to this match
  const availablePlayers = players.filter(
    (player) => !match.playerSnapshots.some((s) => s.id === player.id),
  );

  // Players added to this match
  const matchPlayers = match.playerSnapshots;

  const canStart = match.playerSnapshots.length >= 8 && match.playerSnapshots.length <= 12;
  const canComplete = scoreA !== null && scoreB !== null;

  // Temporary random team generation
  const handleGenerateTeams = () => {
    const shuffled = [...match.playerSnapshots.map((p) => p.id)].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    updateMatch({
      id: match.id,
      data: { teamA: shuffled.slice(0, mid), teamB: shuffled.slice(mid) },
    });
  };

  const handleAddPlayer = () => {
    if (!selectedPlayerId) return;
    const player = players.find((player) => player.id === selectedPlayerId);
    if (!player) return;

    const newSnapshot = { id: player.id, name: player.name, lastName: player.lastName };

    updateMatch({
      id: match.id,
      data: {
        playerSnapshots: [...match.playerSnapshots, newSnapshot],
      },
    });
    setSelectedPlayerId('');
  };

  const handleRemovePlayer = (playerId: string) => {
    updateMatch({
      id: match.id,
      data: {
        playerSnapshots: match.playerSnapshots.filter((player) => player.id !== playerId),
      },
    });
  };

  const teamsDisplay = (
    <Stack direction="row" gap={4} sx={{ mb: 3 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
          {match.status === 'completed' && match.result
            ? `Team A — ${match.result.scoreA} goals`
            : 'Team A'}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {match.teamA.map((id) => {
            const player = match.playerSnapshots.find((p) => p.id === id);
            return player ? (
              <Chip
                key={id}
                label={`${player.name} ${player.lastName}`}
                size="small"
                color="info"
                variant="outlined"
              />
            ) : null;
          })}
        </Stack>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1, textAlign: 'right' }}>
          {match.status === 'completed' && match.result
            ? `Team B — ${match.result.scoreB} goals`
            : 'Team B'}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="flex-end">
          {match.teamB.map((id) => {
            const player = match.playerSnapshots.find((p) => p.id === id);
            return player ? (
              <Chip
                key={id}
                label={`${player.name} ${player.lastName}`}
                size="small"
                color="error"
                variant="outlined"
              />
            ) : null;
          })}
        </Stack>
      </Box>
    </Stack>
  );

  return (
    <>
      <Accordion
        key={match.id}
        elevation={0}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: (theme) => `${theme.shape.borderRadius}px !important`,
          '&:before': { display: 'none' },
          px: 2,
        }}
        expanded={expanded}
        ref={accordionRef}
        onChange={(_, expanded) => {
          setIsExpanded(expanded);
          if (expanded) {
            setTimeout(() => {
              accordionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
          }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', pr: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
              {dayjs(match.date).format('ddd, MMM D, YYYY')}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" fontWeight={500}>
                Match
              </Typography>
              <Typography color="textSecondary">
                {match.playerSnapshots.length} / 12 players
              </Typography>
            </Box>
            {match.status === 'completed' && match.result && (
              <Typography variant="h6" sx={{ mr: '1' }}>
                {match.result.scoreA} — {match.result.scoreB}
              </Typography>
            )}
            <Chip label={status.label} color={status.color} size="small" />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {match.status === 'open' && (
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Players ({match.playerSnapshots.length}/12, min 8)
              </Typography>

              {/* Added players as chips */}
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                {matchPlayers.map((player) => (
                  <Chip
                    key={player.id}
                    label={`${player.name} ${player.lastName}`}
                    onDelete={() => handleRemovePlayer(player.id)}
                    size="small"
                  />
                ))}
              </Stack>

              {/* Add player dropdown */}
              {match.playerSnapshots.length < 12 && availablePlayers.length > 0 && (
                <Stack direction="row" gap={4} sx={{ mb: 2 }}>
                  <Autocomplete
                    options={availablePlayers}
                    getOptionLabel={(player) => `${player.name} ${player.lastName}`}
                    value={
                      availablePlayers.find((player) => player.id === selectedPlayerId) ?? null
                    }
                    onChange={(_, player) => setSelectedPlayerId(player?.id ?? '')}
                    size="small"
                    sx={{ width: '50%' }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select player..." />
                    )}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddPlayer}
                    disabled={!selectedPlayerId || isPending}
                  >
                    Add
                  </Button>
                </Stack>
              )}

              {/* Actions */}
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => setIsCancelDialogOpen(true)}
                  disabled={isDeleting}
                >
                  Cancel match
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  disabled={!canStart || isPending || isDeleting}
                  onClick={() =>
                    updateMatch(
                      { id: match.id, data: { status: 'in_progress' } },
                      {
                        onSuccess: () => showToast('Match started'),
                        onError: () => showToast('Failed to start match', 'error'),
                      },
                    )
                  }
                >
                  {canStart ? 'Start match' : 'Start match (min 8)'}
                </Button>
              </Stack>
            </Box>
          )}

          {match.status === 'in_progress' && (
            <Box>
              {/* Teams section */}
              {!teamsGenerated ? (
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Players ({match.playerSnapshots.length})
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                    {matchPlayers.map((player) => (
                      <Chip
                        key={player.id}
                        label={`${player.name} ${player.lastName}`}
                        size="small"
                      />
                    ))}
                  </Stack>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Generate teams to proceed
                  </Typography>
                  <Button variant="outlined" onClick={handleGenerateTeams} disabled={isPending}>
                    Generate teams
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* Teams display */}
                  {teamsDisplay}

                  {/* Score inputs */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      Team A
                    </Typography>
                    <TextField
                      type="number"
                      value={scoreA ?? ''}
                      onChange={(e) =>
                        setScoreA(
                          e.target.value === ''
                            ? null
                            : Math.max(0, Math.floor(Number(e.target.value))),
                        )
                      }
                      size="small"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          style: { textAlign: 'center', width: 50, MozAppearance: 'textfield' },
                        },
                      }}
                      sx={{
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                          { display: 'none' },
                      }}
                    />
                    <Typography variant="h6">—</Typography>
                    <TextField
                      type="number"
                      value={scoreB ?? ''}
                      onChange={(e) =>
                        setScoreB(
                          e.target.value === ''
                            ? null
                            : Math.max(0, Math.floor(Number(e.target.value))),
                        )
                      }
                      size="small"
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          style: { textAlign: 'center', width: 50, MozAppearance: 'textfield' },
                        },
                      }}
                      sx={{
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                          { display: 'none' },
                      }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      Team B
                    </Typography>
                  </Stack>

                  {/* Actions */}
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={3}>
                    {!canComplete && (
                      <Typography variant="body2" color="textSecondary">
                        Set a score to complete a match
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      disabled={isPending || !canComplete}
                      onClick={() =>
                        updateMatch(
                          {
                            id: match.id,
                            data: {
                              status: 'completed',
                              result: { scoreA: scoreA!, scoreB: scoreB! },
                            },
                          },
                          {
                            onSuccess: () => onMatchUpdated?.('Match completed'),
                            onError: () => showToast('Failed to complete match', 'error'),
                          },
                        )
                      }
                    >
                      Complete match
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          )}

          {match.status === 'completed' && <Box>{teamsDisplay}</Box>}
        </AccordionDetails>

        <ConfirmDialog
          open={isCancelDialogOpen}
          title="Cancel match"
          message="Are you sure you want to cancel this match? All player selections will be lost."
          confirmLabel="Confirm"
          isPending={isDeleting}
          onClose={() => setIsCancelDialogOpen(false)}
          onConfirm={() =>
            deleteMatch(match.id, {
              onSuccess: () => {
                setIsCancelDialogOpen(false);
                onMatchUpdated?.('Match cancelled');
              },
              onError: () => showToast('Failed to cancel match', 'error'),
            })
          }
        />
      </Accordion>

      {toast && <Toast message={toast.message} severity={toast.severity} onClose={hideToast} />}
    </>
  );
}
