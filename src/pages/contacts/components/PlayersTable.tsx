import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { PlayerContact } from '../types/player.types';
import {
  tableBodyRowSx,
  tableContainerSx,
  tableHeadCellSx,
  tableHeaderSx,
  tableHeadRowSx,
} from './PlayersTable.styles';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import PlayerFormDialog from './PlayerFormDialog';
import Toast from '@/shared/components/Toast';
import PlayersTableEmptyState from './PlayersTableEmptyState';
import { usePlayersTableActions } from '../hooks/usePlayersTableActions';

interface PlayersTableProps {
  players: PlayerContact[];
}

export default function PlayersTable({ players }: PlayersTableProps) {
  const {
    playerToDelete,
    playerToEdit,
    isDeleting,
    isUpdating,
    toast,
    hideToast,
    setPlayerToDelete,
    setPlayerToEdit,
    handleDeleteConfirm,
    handleEditSubmit,
  } = usePlayersTableActions();

  return (
    <TableContainer component={Paper} elevation={0} sx={tableContainerSx}>
      <Box sx={tableHeaderSx}>
        <Typography variant="h6">Players list</Typography>
        <Typography variant="body2" color="textSecondary">
          {players.length} player(s)
        </Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={tableHeadRowSx}>
            <TableCell sx={tableHeadCellSx}>Name</TableCell>
            <TableCell sx={tableHeadCellSx}>Last name</TableCell>
            <TableCell sx={tableHeadCellSx}>Email</TableCell>
            <TableCell sx={tableHeadCellSx}>Phone</TableCell>
            <TableCell sx={tableHeadCellSx}>Matches</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        {players.length === 0 ? (
          <PlayersTableEmptyState />
        ) : (
          <TableBody>
            {players.map((player: PlayerContact) => (
              <TableRow key={player.id} hover sx={tableBodyRowSx}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.lastName}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {player.email}
                  </Typography>
                </TableCell>
                <TableCell>{player.phone}</TableCell>
                <TableCell>
                  <Chip label={player.matches} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit player">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setPlayerToEdit(player)}
                      disabled={isUpdating}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete player">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setPlayerToDelete(player)}
                      disabled={isDeleting}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <ConfirmDialog
        open={playerToDelete !== null}
        title="Delete player"
        message={
          <>
            Are you sure you want to delete{' '}
            <strong>
              {playerToDelete?.name} {playerToDelete?.lastName}
            </strong>
            ? This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        isPending={isDeleting}
        onClose={() => setPlayerToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      <PlayerFormDialog
        key={playerToEdit?.id}
        open={playerToEdit !== null}
        onClose={() => setPlayerToEdit(null)}
        onSubmit={handleEditSubmit}
        isPending={isUpdating}
        defaultValues={{
          name: playerToEdit?.name ?? '',
          lastName: playerToEdit?.lastName ?? '',
          email: playerToEdit?.email ?? '',
          phone: playerToEdit?.phone ?? '',
        }}
        title="Edit player"
        submitLabel="Update"
      />

      {toast && <Toast message={toast.message} severity={toast.severity} onClose={hideToast} />}
    </TableContainer>
  );
}
