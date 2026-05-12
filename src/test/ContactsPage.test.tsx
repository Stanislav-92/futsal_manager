import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ContactsPage from '@/pages/contacts/ContactsPage';

const usePlayersMock = vi.fn();
const useAddPlayerMock = vi.fn();
const useToastMock = vi.fn();
const mutateMock = vi.fn();
const showToastMock = vi.fn();

vi.mock('@/pages/contacts/hooks/players.queries', () => ({
  usePlayers: () => usePlayersMock(),
  useAddPlayer: () => useAddPlayerMock(),
}));

vi.mock('@/shared/hooks/useToast', () => ({
  useToast: () => useToastMock(),
}));

vi.mock('@/shared/components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner" />,
}));

vi.mock('@/pages/contacts/components/PlayersTable', () => ({
  default: ({ players }: { players: { id: string }[] }) => (
    <div data-testid="players-table">{players.length} players</div>
  ),
}));

vi.mock('@/pages/contacts/components/PlayerFormDialog', () => ({
  default: ({
    open,
    onSubmit,
    onClose,
  }: {
    open: boolean;
    onSubmit: (data: { name: string; lastName: string; email: string; phone: string }) => void;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="add-dialog">
        <button
          onClick={() =>
            onSubmit({ name: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123456789' })
          }
        >
          submit-dialog
        </button>
        <button onClick={onClose}>close-dialog</button>
      </div>
    ) : null,
}));

describe('ContactsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlayersMock.mockReturnValue({ data: [], isLoading: false, isError: false });
    useAddPlayerMock.mockReturnValue({ mutate: mutateMock, isPending: false });
    useToastMock.mockReturnValue({ toast: null, showToast: showToastMock, hideToast: vi.fn() });
  });

  afterEach(() => cleanup());

  it('renders loading state', () => {
    usePlayersMock.mockReturnValue({ data: [], isLoading: true, isError: false });
    render(<ContactsPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    usePlayersMock.mockReturnValue({ data: [], isLoading: false, isError: true });
    render(<ContactsPage />);
    expect(screen.getByText('Failed to load players')).toBeInTheDocument();
  });

  it('renders players table', () => {
    usePlayersMock.mockReturnValue({
      data: [{ id: '1' }, { id: '2' }],
      isLoading: false,
      isError: false,
    });
    render(<ContactsPage />);
    expect(screen.getByTestId('players-table')).toBeInTheDocument();
    expect(screen.getByText('2 players')).toBeInTheDocument();
  });

  it('opens add dialog on button click', () => {
    render(<ContactsPage />);
    fireEvent.click(screen.getByRole('button', { name: /add player/i }));
    expect(screen.getByTestId('add-dialog')).toBeInTheDocument();
  });

  it('calls mutate with correct payload on submit', () => {
    render(<ContactsPage />);
    fireEvent.click(screen.getByRole('button', { name: /add player/i }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-dialog' }));

    expect(mutateMock).toHaveBeenCalledWith(
      { name: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123456789', matches: 0 },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );
  });

  it('shows success toast on add success', () => {
    mutateMock.mockImplementation((_payload, options) => options.onSuccess());
    render(<ContactsPage />);
    fireEvent.click(screen.getByRole('button', { name: /add player/i }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-dialog' }));
    expect(showToastMock).toHaveBeenCalledWith('Player added successfully');
  });

  it('shows error toast with server message on add error', () => {
    mutateMock.mockImplementation((_payload, options) =>
      options.onError(new Error('Player with this email already exists')),
    );
    render(<ContactsPage />);
    fireEvent.click(screen.getByRole('button', { name: /add player/i }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-dialog' }));
    expect(showToastMock).toHaveBeenCalledWith('Player with this email already exists', 'error');
  });
});
