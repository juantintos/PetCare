import { useMutation, useQueryClient } from '@tanstack/react-query';
import { petsService } from '@/services/pets.service';
import { useSession } from '@/features/auth/hooks';
import { toAppError } from '@/utils/errors';
import { QUERY_KEYS } from '@/constants/app';
import type { CreatePetInput } from '@/types';

export function useCreatePet() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePetInput) => {
      try {
        return await petsService.create(user!.id, input);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      // Invalidamos en vez de actualizar el cache a mano (setQueryData):
      // es más simple y suficientemente rápido para este volumen de datos
      // (KISS) — optimizar con updates optimistas se justificaría solo si
      // la latencia real lo requiriera.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PETS, user?.id] });
    },
  });
}
