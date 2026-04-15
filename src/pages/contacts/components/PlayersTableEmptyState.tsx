import { TableBody, TableCell, TableRow, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

export default function PlayersTableEmptyState() {
  return (
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
  );
}
