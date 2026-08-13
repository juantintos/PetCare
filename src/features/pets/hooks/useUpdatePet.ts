import { useMutation, useQueryClient } from '@tanstack/react-query';
import { petsService } from '@/services/pets.service';
import { useSession } from '@/features/auth/hooks';
import { toAppError } from '@/utils/errors';
import { QUERY_KEYS } from '@/constants/app';
import type { UpdatePetInput } from '@/types';

export function useUpdatePet(petId: string) {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePetInput) => {
      try {
        return await petsService.update(petId, input);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PETS, user?.id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PET, petId] });
    },
  });
}
