import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '@/theme';

/**
 * Qué es: bloque "shimmer" que imita la forma del contenido mientras carga.
 * Por qué lo usamos (en vez de solo un spinner): en listas (mascotas,
 * vacunas) un skeleton comunica MEJOR "esto ya casi está" que un spinner
 * genérico, y evita el salto brusco de layout cuando el contenido real
 * aparece (porque ya ocupa el espacio correcto).
 */
function Pulse({ style }: { style: object }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ backgroundColor: colors.border, borderRadius: radius.sm }, style, animatedStyle]}
    />
  );
}

export function PetCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        gap: spacing.sm,
      }}
    >
      <Pulse style={{ width: 48, height: 48, borderRadius: radius.full }} />
      <Pulse style={{ width: '60%', height: 16 }} />
      <Pulse style={{ width: '40%', height: 12 }} />
    </View>
  );
}

export function ListSkeleton({
  count = 3,
  Item = PetCardSkeleton,
}: {
  count?: number;
  Item?: () => JSX.Element;
}) {
  return (
    <View style={{ gap: spacing.md }}>
      {Array.from({ length: count }).map((_, index) => (
        <Item key={index} />
      ))}
    </View>
  );
}
