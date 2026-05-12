import type { Match } from '../types/match.types';
import MatchTeamsDisplay from './MatchTeamsDisplay';

interface MatchAccordionCompletedProps {
  match: Match;
  activePlayerIds: string[];
}

export default function MatchAccordionCompleted({
  match,
  activePlayerIds,
}: MatchAccordionCompletedProps) {
  return <MatchTeamsDisplay match={match} activePlayerIds={activePlayerIds} />;
}
