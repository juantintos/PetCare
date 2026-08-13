import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { toAppError } from '@/utils/errors';
import type { LoginCredentials } from '@/types';

/**
 * Qué es: hook que encapsula la mutación de login.
 * Por qué lo usamos: la pantalla de login no debe saber que existe
 * TanStack Query, Zustand ni el servicio — solo pide `login(credentials)` y
 * recibe `isPending` / `error`. Esto es lo que el brief pide en el punto 15:
 * `const { data } = usePets()` y nunca `fetch(...)` directo en la pantalla.
 */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        return await authService.login(credentials);
      } catch (error) {
        // Normalizamos aquí para que `mutation.error` SIEMPRE sea un
        // AppError con mensaje amigable, sin importar qué lanzó el servicio.
        throw toAppError(error);
      }
    },
    onSuccess: async ({ user, token }) => {
      await setSession(user, token);
    },
  });
}
