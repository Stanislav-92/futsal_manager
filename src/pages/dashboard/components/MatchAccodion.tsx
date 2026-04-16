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
import { useRef, useState } from 'react';
import { useDeleteMatch, useUpdateMatch } from '../hooks/matches.queries';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/shared/components/Toast';
import { STATUS_CONFIG } from '../constants/matchAccordion.constants';
import MatchAccordionOpen from './MatchAccordionOpen';
import MatchAccordionInProgress from './MatchAccordionInProgress';
import MatchAccordionCompleted from './MatchAccordionCompleted';
import { DISPLAY_DATE_FORMAT } from '@/shared/constants/date.constants';

interface MatchAccordionProps {
  match: Match;
  players: PlayerContact[];
  onMatchUpdated?: (message: string) => void;
}

export default function MatchAccordion({ match, players, onMatchUpdated }: MatchAccordionProps) {
  const [expanded, setIsExpanded] = useState(match.status === 'open');

  const { mutate: updateMatch, isPending } = useUpdateMatch();
  const { mutate: deleteMatch, isPending: isDeleting } = useDeleteMatch();
  const { toast, showToast, hideToast } = useToast();

  const accordionRef = useRef<HTMLDivElement>(null);
  const status = STATUS_CONFIG[match.status];

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

  const handleGenerateTeams = () => {
    const shuffled = [...match.playerSnapshots.map((p) => p.id)].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    updateMatch({
      id: match.id,
      data: { teamA: shuffled.slice(0, mid), teamB: shuffled.slice(mid) },
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
        onSuccess: () => onMatchUpdated?.('Match completed'),
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
            <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
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
              onGenerateTeams={handleGenerateTeams}
              onCompleteMatch={handleCompleteMatch}
            />
          )}
          {match.status === 'completed' && <MatchAccordionCompleted match={match} />}
        </AccordionDetails>
      </Accordion>

      {toast && <Toast message={toast.message} severity={toast.severity} onClose={hideToast} />}
    </>
  );
}
