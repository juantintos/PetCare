import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/features/auth/hooks';

/**
 * Qué es: layout compartido de las pantallas de autenticación.
 * Por qué lo usamos: Expo Router usa la carpeta `(auth)` (con paréntesis)
 * como "grupo de rutas" — organiza login/registro juntos sin que "(auth)"
 * aparezca en la URL.
 *
 * El <Redirect> es el guard real: en cuanto `setSession()` marca al usuario
 * como autenticado (justo después de un login/registro exitoso), este
 * layout se re-renderiza y saca al usuario de (auth) automáticamente — sin
 * que login.tsx necesite llamar a router.replace() manualmente. Como
 * consecuencia, el botón Back tampoco puede volver a login: la pantalla ya
 * no existe en el stack de navegación.
 */
export default function AuthLayout() {
  const { isAuthenticated } = useSession();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="forgot-password"
        options={{ presentation: 'modal', headerShown: true, title: 'Recuperar contraseña' }}
      />
    </Stack>
  );
}
