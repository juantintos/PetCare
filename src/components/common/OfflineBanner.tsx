import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { colors, spacing } from '@/theme';

/**
 * Qué es: banner persistente que aparece cuando el dispositivo pierde
 * conexión.
 * Por qué a nivel de (tabs) y no por pantalla: la pérdida de conexión es un
 * estado transversal a toda la app autenticada, no algo que cada pantalla
 * deba detectar por su cuenta.
 */
export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutUp.duration(200)}
      style={{
        backgroundColor: colors.status.danger,
        paddingVertical: spacing.sm,
        alignItems: 'center',
      }}
    >
      <Text variant="caption" style={{ color: colors.text.inverse }}>
        📡 Sin conexión a internet
      </Text>
    </Animated.View>
  );
}
