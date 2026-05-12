import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import type { Match } from '@/pages/dashboard/types/match.types';

const useMatchesMock = vi.fn();
const useAddMatchMock = vi.fn();
const usePlayersMock = vi.fn();
const useToastMock = vi.fn();

const mutateMock = vi.fn();
const showToastMock = vi.fn();
const hideToastMock = vi.fn();

vi.mock('@/pages/dashboard/hooks/matches.queries', () => ({
  useMatches: () => useMatchesMock(),
  useAddMatch: () => useAddMatchMock(),
}));

vi.mock('@/pages/contacts/hooks/players.queries', () => ({
  usePlayers: () => usePlayersMock(),
}));

vi.mock('@/shared/hooks/useToast', () => ({
  useToast: () => useToastMock(),
}));

vi.mock('@/shared/components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock('@/shared/components/Toast', () => ({
  default: ({ message }: { message: string }) => <div data-testid="toast">{message}</div>,
}));

vi.mock('@/pages/dashboard/components/MatchAccodion', () => ({
  default: ({ match }: { match: Match }) => <div data-testid="match-accordion">{match.id}</div>,
}));

vi.mock('@/pages/dashboard/components/CreateMatchDialog', () => ({
  default: ({
    open,
    onSubmit,
    onClose,
  }: {
    open: boolean;
    onSubmit: (data: { date: { format: (f: string) => string } | null }) => void;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="create-dialog">
        <button
          onClick={() =>
            onSubmit({
              date: { format: () => '2026-05-12' },
            })
          }
        >
          submit-dialog
        </button>
        <button onClick={onClose}>close-dialog</button>
      </div>
    ) : null,
}));

const makeMatch = (id: string, status: Match['status']): Match => ({
  id,
  date: '2026-01-01',
  status,
  playerSnapshots: [],
  teamA: [],
  teamB: [],
});

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useMatchesMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    useAddMatchMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });

    usePlayersMock.mockReturnValue({
      data: [],
    });

    useToastMock.mockReturnValue({
      toast: null,
      showToast: showToastMock,
      hideToast: hideToastMock,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state', () => {
    useMatchesMock.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    useMatchesMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Failed to load matches')).toBeInTheDocument();
  });

  it('renders empty state when no matches', () => {
    render(<DashboardPage />);

    expect(screen.getByText('No matches yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create match' })).toBeEnabled();
  });

  it('renders active and archive sections', () => {
    useMatchesMock.mockReturnValue({
      data: [
        makeMatch('m-open', 'open'),
        makeMatch('m-completed-1', 'completed'),
        makeMatch('m-completed-2', 'completed'),
      ],
      isLoading: false,
      isError: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();

    const accordions = screen.getAllByTestId('match-accordion');
    expect(accordions).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Create match' })).toBeDisabled();
  });

  it('creates match on dialog submit with expected payload', () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Create match' }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-dialog' }));

    expect(mutateMock).toHaveBeenCalledTimes(1);

    const [payload, options] = mutateMock.mock.calls[0];
    expect(payload).toEqual({
      date: '2026-05-12',
      status: 'open',
      playerSnapshots: [],
      teamA: [],
      teamB: [],
    });
    expect(options).toMatchObject({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('shows success toast on create success callback', () => {
    mutateMock.mockImplementation((_payload, options) => options.onSuccess());

    render(<DashboardPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Create match' }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-dialog' }));

    expect(showToastMock).toHaveBeenCalledWith('Match created successfully');
  });

  it('shows error toast on create error callback', () => {
    mutateMock.mockImplementation((_payload, options) => options.onError());

    render(<DashboardPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Create match' }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-dialog' }));

    expect(showToastMock).toHaveBeenCalledWith('Failed to create match', 'error');
  });
});
