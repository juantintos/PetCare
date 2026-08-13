import { useQuery } from '@tanstack/react-query';
import { vaccinesService } from '@/services/vaccines.service';
import { QUERY_KEYS } from '@/constants/app';

export function useVaccinesByPet(petId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.VACCINES, petId],
    queryFn: () => vaccinesService.listByPet(petId!),
    enabled: !!petId,
  });
}
