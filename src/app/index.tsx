import { Redirect } from 'expo-router';
import { useSession } from '@/features/auth/hooks';

/**
 * Qué es: la ruta índice (`/`) nunca renderiza UI propia — solo decide a
 * dónde mandar al usuario.
 * Por qué lo usamos: este es el guard real que el punto 20 del brief pide
 * ("un usuario no autenticado no debe poder acceder a las pantallas
 * privadas"). Como este componente solo se monta DESPUÉS de que
 * `RootLayout` ya esperó a que `authStatus !== 'idle'`, para cuando
 * llegamos aquí siempre sabemos con certeza si hay sesión o no.
 *
 * Usamos `<Redirect replace />` (no `router.replace` en un useEffect) para
 * que la navegación ocurra antes del primer paint — evita el parpadeo de
 * ver por una fracción de segundo la pantalla equivocada.
 */
export default function Index() {
  const { isAuthenticated } = useSession();

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
