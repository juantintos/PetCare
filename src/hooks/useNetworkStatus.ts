import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Qué es: hook que expone si el dispositivo tiene conexión a internet.
 * Por qué lo usamos: el brief (punto 11) exige manejar el estado "Offline"
 * de forma explícita, no dejar que las queries fallen en silencio con un
 * error genérico de red.
 */
export function useNetworkStatus(): { isOffline: boolean } {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return unsubscribe;
  }, []);

  return { isOffline };
}
