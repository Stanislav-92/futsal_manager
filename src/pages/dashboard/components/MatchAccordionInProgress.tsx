import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import type { Match } from '../types/match.types';
import MatchTeamsDisplay from './MatchTeamsDisplay';
import { useState } from 'react';
import { scoreInputSlotProps, scoreInputSx } from './MatchAccordionInProgress.styles';

interface MatchAccordionInProgressProps {
  match: Match;
  isPending: boolean;
  onGenerateTeams: () => void;
  onCompleteMatch: (scoreA: number, scoreB: number) => void;
}

export default function MatchAccordionInProgress({
  match,
  isPending,
  onGenerateTeams,
  onCompleteMatch,
}: MatchAccordionInProgressProps) {
  const [scoreA, setScoreA] = useState<number | null>(null);
  const [scoreB, setScoreB] = useState<number | null>(null);

  const teamsGenerated = match.teamA.length > 0;
  const canComplete = scoreA !== null && scoreB !== null;

  const handleScoreChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (val: number | null) => void,
  ) => {
    setter(event.target.value === '' ? null : Math.max(0, Math.floor(Number(event.target.value))));
  };

  const handleComplete = () => {
    if (!canComplete) return;
    onCompleteMatch(scoreA, scoreB);
  };

  return (
    <Box>
      {!teamsGenerated ? (
        <Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Players ({match.playerSnapshots.length})
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            {match.playerSnapshots.map((player) => (
              <Chip key={player.id} label={`${player.name} ${player.lastName}`} size="small" />
            ))}
          </Stack>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Generate teams to proceed
          </Typography>
          <Button variant="outlined" onClick={onGenerateTeams} disabled={isPending}>
            Generate teams
          </Button>
        </Box>
      ) : (
        <Box>
          <MatchTeamsDisplay match={match} />

          <Stack direction="row" alignItems="center" justifyContent="center" gap={2} sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={500}>
              Team A
            </Typography>
            <TextField
              type="number"
              value={scoreA ?? ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleScoreChange(event, setScoreA)
              }
              size="small"
              slotProps={scoreInputSlotProps}
              sx={scoreInputSx}
            />
            <Typography variant="h6">—</Typography>
            <TextField
              type="number"
              value={scoreB ?? ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleScoreChange(event, setScoreB)
              }
              size="small"
              slotProps={scoreInputSlotProps}
              sx={scoreInputSx}
            />
            <Typography variant="body2" fontWeight={500}>
              Team B
            </Typography>
          </Stack>

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
              onClick={handleComplete}
            >
              Complete match
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
