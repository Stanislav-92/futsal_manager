import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { FULL_TABLE_COLUMNS } from '../constants/fullTableColumns.constants';
import type { PlayerStats } from '../types/playerStats.types';
import { useNavigate } from 'react-router-dom';
import { formatCellValue } from '@/shared/utils/formatCellValue.utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FullTableTabProps {
  stats: PlayerStats[];
  activePlayerIds: string[];
}

export default function FullTableTab({ stats, activePlayerIds }: FullTableTabProps) {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<keyof PlayerStats>('matches');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const navigate = useNavigate();

  const columns = FULL_TABLE_COLUMNS;

  const sortedStats = [...stats].sort((a, b) =>
    sortOrder === 'desc'
      ? (b[sortKey] as number) - (a[sortKey] as number)
      : (a[sortKey] as number) - (b[sortKey] as number),
  );

  const handleSort = (key: keyof PlayerStats) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const handleNavigateToPlayerProfile = (playerId: string) => {
    if (activePlayerIds.includes(playerId)) {
      navigate(`/players/${playerId}`);
    }
  };

  if (sortedStats.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        {t('statistics.noData')}
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        overflow: 'auto',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8fafc' }}>
            {columns.map((col) => {
              const label = t(col.labelKey);
              const tooltip = col.tooltipKey ? t(col.tooltipKey) : undefined;
              return (
                <TableCell key={col.key} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortKey === col.key}
                      direction={sortKey === col.key ? sortOrder : 'desc'}
                      onClick={() => handleSort(col.key as keyof PlayerStats)}
                    >
                      <Box title={tooltip}>{label}</Box>
                    </TableSortLabel>
                  ) : (
                    <Box title={tooltip}>{label}</Box>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStats.map((stat) => (
            <TableRow key={stat.playerId}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Typography
                  variant="body1"
                  sx={{
                    cursor: activePlayerIds.includes(stat.playerId) ? 'pointer' : 'default',
                    '&:hover': activePlayerIds.includes(stat.playerId)
                      ? { color: 'primary.main', textDecoration: 'underline' }
                      : {},
                  }}
                  onClick={() => handleNavigateToPlayerProfile(stat.playerId)}
                >
                  {stat.name} {stat.lastName}
                </Typography>
              </TableCell>
              {columns.slice(1).map((col) => (
                <TableCell key={col.key}>
                  {formatCellValue(col.key, stat[col.key as keyof PlayerStats] as number)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
