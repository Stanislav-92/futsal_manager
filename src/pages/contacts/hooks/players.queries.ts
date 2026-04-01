import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPlayer, deletePlayer, getPlayers, updatePlayer } from '../api/players.api';
import type { PlayerContact } from '../types/player.types';

export const playersQueryKey = ['players'];

export const usePlayers = () => {
  return useQuery({
    queryKey: playersQueryKey,
    queryFn: getPlayers,
  });
};

/* Regular usage of useMutation */
// export const useDeletePlayer = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => deletePlayer(id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: playersQueryKey }),
//   });
// };

/* Optimistic update for player deletion */
export const useDeletePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlayer(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: playersQueryKey });
      const previousPlayers = queryClient.getQueryData<PlayerContact[]>(playersQueryKey);
      queryClient.setQueryData<PlayerContact[]>(
        playersQueryKey,
        (oldPlayers) => oldPlayers?.filter((p) => p.id !== id) ?? [],
      );
      return { previousPlayers };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData<PlayerContact[]>(playersQueryKey, context?.previousPlayers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: playersQueryKey });
    },
  });
};

export const useAddPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (player: Omit<PlayerContact, 'id'>) => addPlayer(player),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: playersQueryKey }),
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<PlayerContact, 'id'> }) =>
      updatePlayer(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: playersQueryKey }),
  });
};
