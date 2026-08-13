import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await clearSession();
      // Limpia todo el cache de datos del servidor (mascotas, vacunas, etc.)
      // para que el próximo usuario que inicie sesión en el mismo
      // dispositivo nunca vea datos de la sesión anterior.
      queryClient.clear();
    },
  });
}
