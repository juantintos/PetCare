import { create } from 'zustand';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/constants/app';
import { secureStorage } from '@/utils/secureStorage';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  setSession: (user: User, token: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
}

/**
 * Qué es: única fuente de verdad sobre "quién está logueado ahora mismo".
 * Por qué Zustand y no Context: evita el problema clásico de Context (todo
 * consumidor re-renderiza en cada cambio); con Zustand cada componente se
 * suscribe solo al slice que le interesa (ej. `useAuthStore((s) => s.user)`).
 * Por qué NO usamos TanStack Query para esto: la sesión no es "datos que se
 * refetchean del servidor", es estado de cliente derivado de un login — por
 * eso vive en Zustand y no en el cache de queries (ver punto 16 del brief).
 *
 * `status: 'idle'` representa "todavía no sabemos si hay sesión" (mientras
 * se lee SecureStore al abrir la app) — evita el parpadeo de mandar al
 * usuario al login para luego redirigirlo al dashboard medio segundo después.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  status: 'idle',

  setSession: async (user, token) => {
    await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await secureStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    set({ user, token, status: 'authenticated' });
  },

  // Se usa tras editar perfil: el token no cambia, solo los datos del usuario.
  updateUser: async (user) => {
    await secureStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    set({ user });
  },

  clearSession: async () => {
    await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await secureStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    set({ user: null, token: null, status: 'unauthenticated' });
  },

  hydrate: async () => {
    const [token, rawUser] = await Promise.all([
      secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
      secureStorage.getItem(STORAGE_KEYS.AUTH_USER),
    ]);

    if (token && rawUser) {
      set({ user: JSON.parse(rawUser) as User, token, status: 'authenticated' });
    } else {
      set({ status: 'unauthenticated' });
    }
  },
}));
