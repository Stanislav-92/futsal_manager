import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Match } from '../types/match.types';
import dayjs from 'dayjs';
import type { PlayerContact } from '@/pages/contacts/types/player.types';
import { useMemo, useRef, useState } from 'react';
import { useDeleteMatch, useUpdateMatch } from '../hooks/matches.queries';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/shared/components/Toast';
import { STATUS_CONFIG } from '../constants/matchAccordion.constants';
import MatchAccordionOpen from './MatchAccordionOpen';
import MatchAccordionInProgress from './MatchAccordionInProgress';
import MatchAccordionCompleted from './MatchAccordionCompleted';
import { DISPLAY_DATE_FORMAT } from '@/shared/constants/date.constants';
import { useIncrementalMatchCount } from '@/pages/contacts/hooks/players.queries';
import type { TeamBalanceMode } from '../types/teamBalanceMode.types';
import { calculatePlayerStats } from '@/pages/statistics/utils/playerStats.utils';
import { balanceTeams, type PlayerRating } from '../utils/teamBalancer.utils';

interface MatchAccordionProps {
  matches: Match[];
  match: Match;
  players: PlayerContact[];
  onMatchUpdated?: (message: string) => void;
}

export default function MatchAccordion({
  matches,
  match,
  players,
  onMatchUpdated,
}: MatchAccordionProps) {
  const [expanded, setIsExpanded] = useState(match.status === 'open');
  const [playerRatings, setPlayerRatings] = useState<PlayerRating[]>([]);

  const { mutate: updateMatch, isPending } = useUpdateMatch();
  const { mutate: deleteMatch, isPending: isDeleting } = useDeleteMatch();
  const { mutate: incrementMatchCount } = useIncrementalMatchCount();
  const { toast, showToast, hideToast } = useToast();

  const allPlayersStats = useMemo(() => calculatePlayerStats(players, matches), [players, matches]);

  const accordionRef = useRef<HTMLDivElement>(null);
  const status = STATUS_CONFIG[match.status];

  const activePlayerIds = players.map((p) => p.id);

  const handleAddPlayer = (playerId: string) => {
    const player = players.find((player) => player.id === playerId);
    if (!player) return;
    const newSnapshot = { id: player.id, name: player.name, lastName: player.lastName };

    updateMatch({
      id: match.id,
      data: {
        playerSnapshots: [...match.playerSnapshots, newSnapshot],
      },
    });
  };

  const handleRemovePlayer = (playerId: string) => {
    updateMatch({
      id: match.id,
      data: {
        playerSnapshots: match.playerSnapshots.filter((player) => player.id !== playerId),
      },
    });
  };

  const handleStartMatch = () => {
    updateMatch(
      { id: match.id, data: { status: 'in_progress' } },
      {
        onSuccess: () => showToast('Match started'),
        onError: () => showToast('Failed to start match', 'error'),
      },
    );
  };

  const handleCancelConfirm = () => {
    deleteMatch(match.id, {
      onSuccess: () => {
        onMatchUpdated?.('Match cancelled');
      },
      onError: () => showToast('Failed to cancel match', 'error'),
    });
  };

  const handleGenerateTeams = (mode: TeamBalanceMode) => {
    const { teamA, teamB, playerRatings } = balanceTeams(
      match.playerSnapshots,
      allPlayersStats,
      mode,
    );
    setPlayerRatings(playerRatings ?? []);
    updateMatch({
      id: match.id,
      data: { teamA, teamB },
    });
  };

  const handleCompleteMatch = (scoreA: number, scoreB: number) => {
    updateMatch(
      {
        id: match.id,
        data: {
          status: 'completed',
          result: { scoreA, scoreB },
        },
      },
      {
        onSuccess: () => {
          incrementMatchCount(match.playerSnapshots.map((p) => p.id));
          onMatchUpdated?.('Match completed');
        },
        onError: () => showToast('Failed to complete match', 'error'),
      },
    );
  };

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
            <Typography variant="body2" color="textSecondary" sx={{ width: 128, flexShrink: 0 }}>
              {dayjs(match.date).format(DISPLAY_DATE_FORMAT)}
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
            <MatchAccordionOpen
              match={match}
              players={players}
              isPending={isPending}
              isDeleting={isDeleting}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
              onStartMatch={handleStartMatch}
              onCancelConfirm={handleCancelConfirm}
            />
          )}
          {match.status === 'in_progress' && (
            <MatchAccordionInProgress
              match={match}
              isPending={isPending}
              playerRatings={playerRatings}
              onGenerateTeams={handleGenerateTeams}
              onCompleteMatch={handleCompleteMatch}
            />
          )}
          {match.status === 'completed' && (
            <MatchAccordionCompleted match={match} activePlayerIds={activePlayerIds} />
          )}
        </AccordionDetails>
      </Accordion>

      {toast && <Toast message={toast.message} severity={toast.severity} onClose={hideToast} />}
    </>
  );
}
