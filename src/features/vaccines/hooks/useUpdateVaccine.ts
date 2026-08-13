import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vaccinesService } from '@/services/vaccines.service';
import { toAppError } from '@/utils/errors';
import { QUERY_KEYS } from '@/constants/app';
import type { UpdateVaccineInput } from '@/types';

export function useUpdateVaccine(vaccineId: string, petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateVaccineInput) => {
      try {
        return await vaccinesService.update(vaccineId, input);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACCINES, petId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACCINE, vaccineId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACCINES] });
    },
  });
}
