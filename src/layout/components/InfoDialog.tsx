import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function InfoDialog({ open, onClose }: InfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>How Futsal Manager works</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Matches
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Create a match, add 8-12 players, then start it. Once started, generate balanced teams
          using one of three algorithms. Enter the final score to complete the match.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Team Balancing
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          <strong>Power Index</strong> - balances teams based on win rate (40%), average points per
          game (40%), and goal difference (20%). Best for competitive balance.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          <strong>Win Rate</strong> - balances teams purely based on win percentage.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          <strong>Random</strong> - randomly assigns players to teams.
        </Typography>
        <Typography variant="caption" color="textSecondary">
          * Players with less than 2 matches receive a default neutral rating of 0.33.
        </Typography>

        <Divider sx={{ mb: 2, mt: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Statistics
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          After completing matches, player statistics are automatically updated. View leaderboards
          and full table on the Statistics page. Click on any player to see their personal profile
          with charts and detailed stats.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Players
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage player contacts on the Contacts page. Players added to matches are stored as
          snapshots - even if a player is deleted, their name remains in completed match history.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
