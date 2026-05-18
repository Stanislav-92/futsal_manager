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
import { Trans, useTranslation } from 'react-i18next';

interface PlayersTableProps {
  players: PlayerContact[];
}

export default function PlayersTable({ players }: PlayersTableProps) {
  const { t } = useTranslation();
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
        <Typography variant="h6">{t('contacts.playersList')}</Typography>
        <Typography variant="body2" color="textSecondary">
          {t('contacts.playersCount', { count: players.length })}
        </Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={tableHeadRowSx}>
            <TableCell sx={tableHeadCellSx}>{t('fields.name')}</TableCell>
            <TableCell sx={tableHeadCellSx}>{t('fields.lastName')}</TableCell>
            <TableCell sx={tableHeadCellSx}>{t('fields.email')}</TableCell>
            <TableCell sx={tableHeadCellSx}>{t('fields.phone')}</TableCell>
            <TableCell sx={tableHeadCellSx}>{t('leaderboards.matches')}</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">
              {t('common.actions')}
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
                  <Tooltip title={t('contacts.editTooltip')}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setPlayerToEdit(player)}
                      disabled={isUpdating}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('contacts.deleteTooltip')}>
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
        title={t('contacts.deleteTitle')}
        message={
          <Trans
            i18nKey="contacts.deleteMessage"
            values={{
              name: `${playerToDelete?.name ?? ''} ${playerToDelete?.lastName ?? ''}`.trim(),
            }}
            components={{ strong: <strong /> }}
          />
        }
        confirmLabel={t('common.delete')}
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
        title={t('contacts.editPlayer')}
        submitLabel={t('common.update')}
      />

      {toast && <Toast message={toast.message} severity={toast.severity} onClose={hideToast} />}
    </TableContainer>
  );
}
