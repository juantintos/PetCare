import { useQuery } from '@tanstack/react-query';
import { petsService } from '@/services/pets.service';
import { useSession } from '@/features/auth/hooks';
import { QUERY_KEYS } from '@/constants/app';

/**
 * Qué es: hook de lectura de la lista de mascotas del usuario actual.
 * Por qué `enabled: !!user`: evita disparar la query antes de tener sesión
 * (por ejemplo, en el instante entre montar la pantalla y que useSession
 * resuelva el usuario) — sin esto, TanStack Query intentaría pedir
 * "mascotas de undefined".
 */
export function usePets() {
  const { user } = useSession();

  return useQuery({
    queryKey: [QUERY_KEYS.PETS, user?.id],
    queryFn: () => petsService.list(user!.id),
    enabled: !!user,
  });
}
