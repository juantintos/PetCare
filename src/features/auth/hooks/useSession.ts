import { useAuthStore } from '@/stores/auth.store';

/**
 * Qué es: hook de lectura del estado de sesión, pensado para las pantallas
 * (no para mutar la sesión, solo para leerla).
 * Por qué lo usamos: evita que cada componente importe `useAuthStore`
 * directamente y tenga que saber qué selector usar — un solo punto de
 * entrada legible: `const { user, isAuthenticated } = useSession()`.
 */
export function useSession() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'idle',
  };
}
