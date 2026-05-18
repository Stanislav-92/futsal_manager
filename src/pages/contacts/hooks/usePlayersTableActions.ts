import { useState } from 'react';
import type { PlayerContact } from '../types/player.types';
import { useDeletePlayer, useUpdatePlayer } from './players.queries';
import { useToast } from '@/shared/hooks/useToast';
import { useTranslation } from 'react-i18next';

export const usePlayersTableActions = () => {
  const { t } = useTranslation();
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
        showToast(t('contacts.deleteSuccess'));
      },
      onError: () => showToast(t('contacts.deleteError'), 'error'),
    });
  };

  const handleEditSubmit = (data: Omit<PlayerContact, 'id' | 'matches'>) => {
    if (!playerToEdit) return;

    updatePlayer(
      { id: playerToEdit.id, data: { ...data, matches: playerToEdit.matches } },
      {
        onSuccess: () => {
          setPlayerToEdit(null);
          showToast(t('contacts.updateSuccess'));
        },
        onError: () => showToast(t('contacts.updateError'), 'error'),
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
