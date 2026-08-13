import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vaccinesService } from '@/services/vaccines.service';
import { toAppError } from '@/utils/errors';
import { QUERY_KEYS } from '@/constants/app';
import type { CreateVaccineInput } from '@/types';

export function useCreateVaccine(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateVaccineInput) => {
      try {
        return await vaccinesService.create(input);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACCINES, petId] });
      // El dashboard muestra contadores de "próximas/vencidas" que dependen
      // de esta vacuna nueva — invalidamos todo lo que empiece con VACCINES.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VACCINES] });
    },
  });
}
