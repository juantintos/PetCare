import { useQuery } from '@tanstack/react-query';
import { vaccinesService } from '@/services/vaccines.service';
import { QUERY_KEYS } from '@/constants/app';

export function useVaccine(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.VACCINE, id],
    queryFn: () => vaccinesService.getById(id!),
    enabled: !!id,
  });
}
