import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import StatisticsPage from '@/pages/statistics/StatisticsPage';

const useMatchesMock = vi.fn();
const usePlayersMock = vi.fn();

vi.mock('@/pages/dashboard/hooks/matches.queries', () => ({
  useMatches: () => useMatchesMock(),
}));

vi.mock('@/pages/contacts/hooks/players.queries', () => ({
  usePlayers: () => usePlayersMock(),
}));

vi.mock('@/shared/components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner" />,
}));

vi.mock('@/pages/statistics/components/LeaderboardsTab', () => ({
  default: () => <div data-testid="leaderboards-tab" />,
}));

vi.mock('@/pages/statistics/components/FullTableTab', () => ({
  default: () => <div data-testid="full-table-tab" />,
}));

describe('StatisticsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMatchesMock.mockReturnValue({ data: [], isLoading: false, isError: false });
    usePlayersMock.mockReturnValue({ data: [], isLoading: false, isError: false });
  });

  afterEach(() => cleanup());

  it('renders loading state', () => {
    useMatchesMock.mockReturnValue({ data: [], isLoading: true, isError: false });
    render(<StatisticsPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    useMatchesMock.mockReturnValue({ data: [], isLoading: false, isError: true });
    render(<StatisticsPage />);
    expect(screen.getByText('Failed to load statistics')).toBeInTheDocument();
  });

  it('renders leaderboards tab by default', () => {
    render(<StatisticsPage />);
    expect(screen.getByTestId('leaderboards-tab')).toBeInTheDocument();
  });

  it('switches to full table tab on click', () => {
    render(<StatisticsPage />);
    fireEvent.click(screen.getByRole('tab', { name: /full table/i }));
    expect(screen.getByTestId('full-table-tab')).toBeInTheDocument();
  });

  it('renders both tabs in navigation', () => {
    render(<StatisticsPage />);
    expect(screen.getByRole('tab', { name: /leaderboards/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /full table/i })).toBeInTheDocument();
  });

  it('handles partial data load - matches error while players load', () => {
    useMatchesMock.mockReturnValue({ data: [], isLoading: false, isError: true });
    usePlayersMock.mockReturnValue({
      data: [{ id: '1', name: 'John' }],
      isLoading: false,
      isError: false,
    });
    render(<StatisticsPage />);
    expect(screen.getByText('Failed to load statistics')).toBeInTheDocument();
  });
});
