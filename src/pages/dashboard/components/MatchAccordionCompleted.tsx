import type { Match } from '../types/match.types';
import MatchTeamsDisplay from './MatchTeamsDisplay';

interface MatchAccordionCompletedProps {
  match: Match;
}

export default function MatchAccordionCompleted({ match }: MatchAccordionCompletedProps) {
  return <MatchTeamsDisplay match={match} />;
}
