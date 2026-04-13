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
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import type { PlayerContact } from '../types/player.types';
import {
  tableBodyRowSx,
  tableContainerSx,
  tableHeadCellSx,
  tableHeaderSx,
  tableHeadRowSx,
} from './PlayersTable.styles';
import { useDeletePlayer, useUpdatePlayer } from '../hooks/players.queries';
import { useState } from 'react';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import PlayerFormDialog from './PlayerFormDialog';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/shared/components/Toast';

interface PlayersTableProps {
  players: PlayerContact[];
}

export default function PlayersTable({ players }: PlayersTableProps) {
  const [playerToDelete, setPlayerToDelete] = useState<PlayerContact | null>(null);
  const [playerToEdit, setPlayerToEdit] = useState<PlayerContact | null>(null);
  const { mutate: deletePlayer, isPending: isDeleting } = useDeletePlayer();
  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer();

  const { toast, showToast, hideToast } = useToast();

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
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                <PeopleOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="textSecondary">
                  No players yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Click "Add player" to get started
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
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
        onConfirm={() => {
          if (playerToDelete) {
            deletePlayer(playerToDelete.id, {
              onSuccess: () => {
                setPlayerToDelete(null);
                showToast('Player deleted successfully');
              },
              onError: () => showToast('Failed to delete player', 'error'),
            });
          }
        }}
      />

      <PlayerFormDialog
        key={playerToEdit?.id}
        open={playerToEdit !== null}
        onClose={() => setPlayerToEdit(null)}
        onSubmit={(data) => {
          if (playerToEdit) {
            updatePlayer(
              { id: playerToEdit.id, data: { ...data, matches: playerToEdit.matches } },
              {
                onSuccess: () => {
                  setPlayerToEdit(null);
                  showToast('Player updated successfully');
                },
                onError: () => showToast('Failed to update player', 'error'),
              },
            );
          }
        }}
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
