import { Platform } from 'react-native';

/**
 * Qué es: sombras predefinidas (sm/md/lg).
 * Por qué lo usamos: React Native maneja sombras distinto en iOS (shadow*)
 * y Android (elevation). Repetir esta lógica por componente es propenso a
 * error y difícil de mantener.
 * Qué problema resuelve: cada componente pide una sombra "por nombre"
 * (sm/md/lg) sin preocuparse por la plataforma subyacente.
 */
const createShadow = (elevation: number, opacity: number, radius: number) =>
  Platform.select({
    ios: {
      shadowColor: '#1F2A27',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    default: {},
  });

export const shadows = {
  sm: createShadow(2, 0.06, 4),
  md: createShadow(4, 0.08, 8),
  lg: createShadow(8, 0.1, 16),
} as const;
