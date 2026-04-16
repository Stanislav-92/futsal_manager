import { Box, Chip, Stack, Typography } from '@mui/material';
import type { Match } from '../types/match.types';

interface MatchTeamsDisplayProps {
  match: Match;
}

export default function MatchTeamsDisplay({ match }: MatchTeamsDisplayProps) {
  return (
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
}
