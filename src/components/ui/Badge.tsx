import { View } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

export interface BadgeProps {
  label: string;
  tone: BadgeTone;
  icon?: string;
}

const toneStyles: Record<BadgeTone, { bg: string; text: string }> = {
  success: { bg: '#E7F4EC', text: colors.status.success },
  warning: { bg: colors.accent.light, text: '#B8710F' },
  danger: { bg: '#FBE7E1', text: colors.status.danger },
  neutral: { bg: colors.primary.light, text: colors.primary.dark },
};

/**
 * Qué es: etiqueta visual pequeña para comunicar un estado.
 * Por qué lo usamos: el brief pide "no depender únicamente del color para
 * comunicar estados" (accesibilidad). Badge siempre combina color + texto
 * (y opcionalmente un ícono), nunca solo un punto de color.
 */
export function Badge({ label, tone }: BadgeProps) {
  const style = toneStyles[tone];

  return (
    <View
      style={{
        backgroundColor: style.bg,
        borderRadius: radius.full,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        alignSelf: 'flex-start',
      }}
      accessibilityRole="text"
    >
      <Text variant="label" style={{ color: style.text }}>
        {label}
      </Text>
    </View>
  );
}
