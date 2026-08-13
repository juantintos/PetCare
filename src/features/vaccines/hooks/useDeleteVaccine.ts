import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vaccinesService } from '@/services/vaccines.service';
import { toAppError } from '@/utils/errors';
import { QUERY_KEYS } from '@/constants/app';

export function useDeleteVaccine(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vaccineId: string) => {
      try {
        await vaccinesService.remove(vaccineId);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACCINES, petId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACCINES] });
    },
  });
}
