import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Match } from '../types/match.types';
import MatchTeamsDisplay from './MatchTeamsDisplay';
import { useState } from 'react';
import { scoreInputSlotProps, scoreInputSx } from './MatchAccordionInProgress.styles';
import type { TeamBalanceMode } from '../types/teamBalanceMode.types';
import { TEAM_BALANCE_OPTIONS } from '../constants/teamBalanceOptions.constants';
import type { PlayerRating } from '../utils/teamBalancer.utils';
import { useTranslation } from 'react-i18next';

interface MatchAccordionInProgressProps {
  match: Match;
  isPending: boolean;
  playerRatings: PlayerRating[];
  onGenerateTeams: (mode: TeamBalanceMode) => void;
  onCompleteMatch: (scoreA: number, scoreB: number) => void;
}

export default function MatchAccordionInProgress({
  match,
  isPending,
  playerRatings,
  onGenerateTeams,
  onCompleteMatch,
}: MatchAccordionInProgressProps) {
  const { t } = useTranslation();
  const [scoreA, setScoreA] = useState<number | null>(null);
  const [scoreB, setScoreB] = useState<number | null>(null);

  const [balanceMode, setBalanceMode] = useState<TeamBalanceMode | null>(null);
  const [generatedMode, setGeneratedMode] = useState<TeamBalanceMode | null>(null);

  const balanceOptions = TEAM_BALANCE_OPTIONS;
  const teamsGenerated = match.teamA.length > 0;
  const canGenerate = balanceMode !== null;
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
      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {t('match.playersOnly', { count: match.playerSnapshots.length })}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {match.playerSnapshots.map((player) => (
            <Chip key={player.id} label={`${player.name} ${player.lastName}`} size="small" />
          ))}
        </Stack>
        <Stack direction="row" alignItems="center" gap={6} sx={{ mb: 3 }}>
          <RadioGroup
            row
            value={balanceMode ?? ''}
            onChange={(e) => setBalanceMode(e.target.value as TeamBalanceMode)}
          >
            {balanceOptions.map((option) => (
              <Tooltip key={option.value} title={t(option.tooltipKey)} arrow placement="top">
                <FormControlLabel
                  value={option.value}
                  control={<Radio size="small" />}
                  label={t(option.labelKey)}
                />
              </Tooltip>
            ))}
          </RadioGroup>
          <Button
            variant="outlined"
            onClick={() => {
              onGenerateTeams(balanceMode as TeamBalanceMode);
              setGeneratedMode(balanceMode);
            }}
            disabled={!canGenerate || isPending}
          >
            {teamsGenerated ? t('match.regenerateTeams') : t('match.generateTeams')}
          </Button>
          {teamsGenerated && generatedMode && (
            <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
              {t('match.balancingType')}{' '}
              <strong>{t(balanceOptions.find((o) => o.value === generatedMode)!.labelKey)}</strong>
            </Typography>
          )}
        </Stack>
      </Box>

      {teamsGenerated && (
        <Box>
          <MatchTeamsDisplay
            match={match}
            balanceMode={generatedMode}
            currentMode={balanceMode}
            playerRatings={playerRatings}
          />

          <Stack direction="row" alignItems="center" justifyContent="center" gap={2} sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={500}>
              {t('common.teamA')}
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
              {t('common.teamB')}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={3}>
            {!canComplete && (
              <Typography variant="body2" color="textSecondary">
                {t('match.setScoreHint')}
              </Typography>
            )}
            <Button
              variant="contained"
              color="success"
              disabled={isPending || !canComplete}
              onClick={handleComplete}
            >
              {t('match.completeMatch')}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
