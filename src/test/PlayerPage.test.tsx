import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import PlayerPage from '@/pages/players/PlayerPage';

const useMatchesMock = vi.fn();
const usePlayersMock = vi.fn();
const useParamsMock = vi.fn();
const useNavigateMock = vi.fn();

vi.mock('react-router-dom', () => ({
  useParams: () => useParamsMock(),
  useNavigate: () => useNavigateMock(),
}));

vi.mock('@/pages/dashboard/hooks/matches.queries', () => ({
  useMatches: () => useMatchesMock(),
}));

vi.mock('@/pages/contacts/hooks/players.queries', () => ({
  usePlayers: () => usePlayersMock(),
}));

vi.mock('@/shared/components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner" />,
}));

vi.mock('@/pages/players/components/PlayerCharts', () => ({
  default: () => <div data-testid="player-charts" />,
}));

vi.mock('@/pages/players/components/PlayerStatsSummary', () => ({
  default: ({ playerName }: { playerName: string }) => (
    <div data-testid="player-stats-summary">{playerName}</div>
  ),
}));

const makePlayer = (id: string) => ({
  id,
  name: 'Lionel',
  lastName: 'Messi',
  email: 'messi@test.com',
  phone: '123456789',
  matches: 3,
});

describe('PlayerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParamsMock.mockReturnValue({ id: 'player-1' });
    useNavigateMock.mockReturnValue(vi.fn());
    useMatchesMock.mockReturnValue({ data: [], isLoading: false });
    usePlayersMock.mockReturnValue({ data: [], isLoading: false });
  });

  afterEach(() => cleanup());

  it('renders loading state', () => {
    useMatchesMock.mockReturnValue({ data: [], isLoading: true });
    render(<PlayerPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders player not found when player does not exist', () => {
    usePlayersMock.mockReturnValue({ data: [], isLoading: false });
    render(<PlayerPage />);
    expect(screen.getByText('Player not found')).toBeInTheDocument();
  });

  it('renders player name in stats summary', () => {
    usePlayersMock.mockReturnValue({
      data: [makePlayer('player-1')],
      isLoading: false,
    });
    render(<PlayerPage />);
    expect(screen.getByTestId('player-stats-summary')).toBeInTheDocument();
    expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
  });

  it('renders charts when player exists', () => {
    usePlayersMock.mockReturnValue({
      data: [makePlayer('player-1')],
      isLoading: false,
    });
    render(<PlayerPage />);
    expect(screen.getByTestId('player-charts')).toBeInTheDocument();
  });

  it('renders back button', () => {
    usePlayersMock.mockReturnValue({
      data: [makePlayer('player-1')],
      isLoading: false,
    });
    render(<PlayerPage />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });
});
