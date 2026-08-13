import { useQuery } from '@tanstack/react-query';
import { vaccinesService } from '@/services/vaccines.service';
import { QUERY_KEYS } from '@/constants/app';

export function useVaccinesByPetIds(petIds: string[]) {
  return useQuery({
    queryKey: [QUERY_KEYS.VACCINES, 'byPetIds', ...petIds].filter(Boolean),
    queryFn: () => vaccinesService.listByPetIds(petIds),
    enabled: petIds.length > 0,
  });
}
