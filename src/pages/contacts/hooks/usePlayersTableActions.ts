import { useState } from 'react';
import type { PlayerContact } from '../types/player.types';
import { useDeletePlayer, useUpdatePlayer } from './players.queries';
import { useToast } from '@/shared/hooks/useToast';

export const usePlayersTableActions = () => {
  const [playerToDelete, setPlayerToDelete] = useState<PlayerContact | null>(null);
  const [playerToEdit, setPlayerToEdit] = useState<PlayerContact | null>(null);
  const { mutate: deletePlayer, isPending: isDeleting } = useDeletePlayer();
  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer();

  const { toast, showToast, hideToast } = useToast();

  const handleDeleteConfirm = () => {
    if (!playerToDelete) return;

    deletePlayer(playerToDelete.id, {
      onSuccess: () => {
        setPlayerToDelete(null);
        showToast('Player deleted successfully');
      },
      onError: () => showToast('Failed to delete player', 'error'),
    });
  };

  const handleEditSubmit = (data: Omit<PlayerContact, 'id' | 'matches'>) => {
    if (!playerToEdit) return;

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
  };

  return {
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
  };
};
