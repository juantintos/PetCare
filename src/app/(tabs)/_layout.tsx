import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useSession } from '@/features/auth/hooks';
import { OfflineBanner } from '@/components/common/OfflineBanner';

/**
 * Qué es: navegación por tabs para las 3 áreas principales de la app
 * autenticada (punto 20 del brief).
 * Por qué lo usamos: es el patrón estándar de apps móviles para 3-5
 * secciones de igual jerarquía — el usuario siempre sabe cómo volver a
 * cualquiera de ellas con un solo toque.
 *
 * El <Redirect> es la segunda capa de protección de rutas privadas: si el
 * token se invalida o el usuario cierra sesión mientras está en (tabs),
 * este layout lo saca inmediatamente a login (defensa en profundidad,
 * además del guard de `src/app/index.tsx`).
 */
export default function TabsLayout() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <OfflineBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary.DEFAULT,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: { borderTopColor: colors.border },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: 'Mascotas',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
