import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { PlayerStats } from '../types/playerStats.types';
import { useNavigate } from 'react-router-dom';

interface LeaderboardBlockProps {
  title: string;
  stats: PlayerStats[];
  activePlayerIds: string[];
  getValue: (stat: PlayerStats) => number;
  formatValue: (value: number) => string;
}

export default function LeaderboardBlock({
  title,
  stats,
  activePlayerIds,
  getValue,
  formatValue,
}: LeaderboardBlockProps) {
  const navigate = useNavigate();

  const topFive = [...stats]
    .filter((stat) => stat.matches > 0)
    .sort((a, b) => getValue(b) - getValue(a))
    .slice(0, 5);

  const handleNavigateToPlayerProfile = (playerId: string) => {
    if (activePlayerIds.includes(playerId)) {
      navigate(`/players/${playerId}`);
    }
  };

  if (topFive.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: (theme) => `${theme.shape.borderRadius}px`,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ backgroundColor: 'primary.light', px: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <EmojiEventsIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="textSecondary">
            No data yet
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ backgroundColor: 'primary.light', px: 2, py: 1.5 }}>
        <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>{title}</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack>
          {topFive.map((stat, index) => (
            <Box key={stat.playerId}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                <Typography variant="body1" color="textSecondary" sx={{ minWidth: 20 }}>
                  {index + 1}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    cursor: activePlayerIds.includes(stat.playerId) ? 'pointer' : 'default',
                    '&:hover': activePlayerIds.includes(stat.playerId)
                      ? { color: 'primary.main', textDecoration: 'underline' }
                      : {},
                  }}
                  onClick={() => handleNavigateToPlayerProfile(stat.playerId)}
                >
                  {stat.name} {stat.lastName}
                </Typography>
                <Typography variant="body1">{formatValue(getValue(stat))}</Typography>
              </Box>
              {index < topFive.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
