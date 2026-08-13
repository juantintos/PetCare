import { useQuery } from '@tanstack/react-query';
import { petsService } from '@/services/pets.service';
import { QUERY_KEYS } from '@/constants/app';

export function usePet(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.PET, id],
    queryFn: () => petsService.getById(id!),
    enabled: !!id,
  });
}
