import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMatch, deleteMatch, getMatches, updateMatch } from '../api/matches.api';
import type { Match } from '../types/match.types';

export const matchesQueryKey = ['matches'];

export const useMatches = () => {
  return useQuery({
    queryKey: matchesQueryKey,
    queryFn: getMatches,
  });
};

export const useAddMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (match: Omit<Match, 'id'>) => addMatch(match),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matchesQueryKey }),
  });
};

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Match, 'id'>> }) =>
      updateMatch(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matchesQueryKey }),
  });
};

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMatch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matchesQueryKey }),
  });
};
