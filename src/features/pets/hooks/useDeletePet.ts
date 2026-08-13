import { useMutation, useQueryClient } from '@tanstack/react-query';
import { petsService } from '@/services/pets.service';
import { vaccinesService } from '@/services/vaccines.service';
import { useSession } from '@/features/auth/hooks';
import { toAppError } from '@/utils/errors';
import { QUERY_KEYS } from '@/constants/app';

export function useDeletePet() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petId: string) => {
      try {
        // Elimina primero las vacunas asociadas para no dejar datos
        // huérfanos en el mock (un backend real haría esto vía CASCADE).
        await vaccinesService.removeByPetId(petId);
        await petsService.remove(petId);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PETS, user?.id] });
    },
  });
}
