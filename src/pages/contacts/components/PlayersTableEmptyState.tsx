import { TableBody, TableCell, TableRow, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { useTranslation } from 'react-i18next';

export default function PlayersTableEmptyState() {
  const { t } = useTranslation();

  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
          <PeopleOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="textSecondary">
            {t('contacts.noPlayers')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('contacts.noPlayersHint')}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
