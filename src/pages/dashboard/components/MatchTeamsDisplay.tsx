import { Box, Chip, Stack, Typography } from '@mui/material';
import type { Match } from '../types/match.types';
import { useNavigate } from 'react-router-dom';
import type { TeamBalanceMode } from '../types/teamBalanceMode.types';
import { calculateAvgRating, formatRating, type PlayerRating } from '../utils/teamBalancer.utils';

interface MatchTeamsDisplayProps {
  match: Match;
  activePlayerIds?: string[];
  balanceMode?: TeamBalanceMode | null;
  currentMode?: TeamBalanceMode | null;
  playerRatings?: PlayerRating[];
}

export default function MatchTeamsDisplay({
  match,
  activePlayerIds,
  balanceMode,
  currentMode,
  playerRatings,
}: MatchTeamsDisplayProps) {
  const navigate = useNavigate();

  const showRatings =
    balanceMode &&
    balanceMode !== 'random' &&
    balanceMode === currentMode &&
    playerRatings &&
    playerRatings.length > 0;

  const getChipLabel = (id: string, name: string, lastName: string): string => {
    const defaultLabel = `${name} ${lastName}`;
    if (!showRatings) return defaultLabel;
    const rating = playerRatings.find((rating) => rating.playerId === id);
    if (!rating) return defaultLabel;
    const formattedRating = formatRating(rating, balanceMode);
    const suffix = !rating.hasEnoughMatches ? '*' : '';
    return `${name} ${lastName} (${formattedRating})${suffix}`;
  };

  const getTeamTitle = (teamIds: string[], goals?: number, label = 'Team'): string => {
    if (match.status === 'completed' && goals !== undefined) {
      return `${label} — ${goals} goals`;
    }
    if (showRatings) {
      return `${label} (avg: ${calculateAvgRating(teamIds, playerRatings, balanceMode)})`;
    }
    return label;
  };

  const handleNavigateToPlayerProfile = (playerId: string) => {
    if (activePlayerIds?.includes(playerId)) {
      navigate(`/players/${playerId}`);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" gap={4}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            {getTeamTitle(match.teamA, match.result?.scoreA, 'Team A')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {match.teamA.map((id) => {
              const player = match.playerSnapshots.find((p) => p.id === id);
              return player ? (
                <Chip
                  key={id}
                  label={getChipLabel(id, player.name, player.lastName)}
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() => handleNavigateToPlayerProfile(player.id)}
                  sx={{ cursor: activePlayerIds?.includes(id) ? 'pointer' : 'default' }}
                />
              ) : null;
            })}
          </Stack>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1, textAlign: 'right' }}>
            {getTeamTitle(match.teamB, match.result?.scoreB, 'Team B')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="flex-end">
            {match.teamB.map((id) => {
              const player = match.playerSnapshots.find((p) => p.id === id);
              return player ? (
                <Chip
                  key={id}
                  label={getChipLabel(id, player.name, player.lastName)}
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleNavigateToPlayerProfile(player.id)}
                  sx={{ cursor: activePlayerIds?.includes(id) ? 'pointer' : 'default' }}
                />
              ) : null;
            })}
          </Stack>
        </Box>
      </Stack>
      {showRatings && playerRatings.some((rating) => !rating.hasEnoughMatches) && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 2, display: 'block', textAlign: 'right' }}
        >
          * Default rating (0.33) applied for players with less than 2 matches
        </Typography>
      )}
    </Box>
  );
}
