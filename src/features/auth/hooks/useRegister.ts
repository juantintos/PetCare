import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { toAppError } from '@/utils/errors';
import type { RegisterCredentials } from '@/types';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      try {
        return await authService.register(credentials);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: async ({ user, token }) => {
      // Registrarse deja al usuario logueado de inmediato — evita el paso
      // extra de "regístrate y ahora inicia sesión" que frustra a usuarios.
      await setSession(user, token);
    },
  });
}
