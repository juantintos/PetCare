import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useAuthStore } from '@/stores/auth.store';
import { ToastProvider } from '@/components/common/Toast';
import '../theme/global.css';

// Evita que el splash screen se oculte automáticamente antes de que las
// fuentes hayan terminado de cargar (si no, se ve un "flash" de texto sin
// estilizar apenas arranca la app).
SplashScreen.preventAutoHideAsync();

/**
 * Qué es: una única instancia de QueryClient para toda la app.
 * Por qué lo usamos: TanStack Query necesita un cliente compartido para que
 * el cache funcione entre pantallas (p. ej. la lista de mascotas y el
 * detalle de una mascota comparten el mismo cache).
 * Qué problema resuelve: si se creara un QueryClient nuevo en cada pantalla,
 * no habría cache real ni invalidación cruzada entre queries relacionadas.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minuto: razonable para datos que cambian poco
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const hydrate = useAuthStore((state) => state.hydrate);
  const authStatus = useAuthStore((state) => state.status);

  // Al abrir la app, leemos el token de SecureStore UNA vez para saber si
  // hay una sesión previa. Mientras `authStatus === 'idle'`, la ruta índice
  // (`src/app/index.tsx`) no decide a dónde redirigir todavía.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isReady = (fontsLoaded || !!fontError) && authStatus !== 'idle';

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </QueryClientProvider>
  );
}
