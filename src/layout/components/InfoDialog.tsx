import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function InfoDialog({ open, onClose }: InfoDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('info.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {t('info.matchesTitle')}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {t('info.matchesBody')}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {t('info.balancingTitle')}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 1 }}
          component="span"
          display="block"
        >
          <Trans i18nKey="info.powerIndexBody" />
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 1 }}
          component="span"
          display="block"
        >
          <Trans i18nKey="info.winRateBody" />
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2 }}
          component="span"
          display="block"
        >
          <Trans i18nKey="info.randomBody" />
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('info.ratingNote')}
        </Typography>

        <Divider sx={{ mb: 2, mt: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {t('info.statisticsTitle')}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {t('info.statisticsBody')}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {t('info.playersTitle')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t('info.playersBody')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          {t('common.gotIt')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
