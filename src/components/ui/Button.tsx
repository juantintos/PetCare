import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number }> = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing['2xl'] },
};

const variantStyles: Record<ButtonVariant, { bg: string; border?: string; text: string }> = {
  primary: { bg: colors.primary.DEFAULT, text: colors.text.inverse },
  secondary: { bg: colors.accent.DEFAULT, text: colors.text.inverse },
  outline: { bg: 'transparent', border: colors.primary.DEFAULT, text: colors.primary.DEFAULT },
  ghost: { bg: 'transparent', text: colors.primary.DEFAULT },
  danger: { bg: colors.status.danger, text: colors.text.inverse },
};

/**
 * Qué es: botón reutilizable con variantes visuales, tamaños y estado de carga.
 * Por qué lo usamos: cada pantalla necesitará botones (guardar, cancelar,
 * eliminar, etc.) y repetir estilos + lógica de "disabled mientras carga" en
 * cada formulario es una fuente enorme de código duplicado e inconsistencias.
 * Qué problema resuelve: centraliza el estado "pressed" (microinteracción),
 * el estado de loading y evita doble-submit (ver disabled más abajo).
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => [
        {
          backgroundColor: variantStyle.bg,
          borderWidth: variantStyle.border ? 1 : 0,
          borderColor: variantStyle.border,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
          opacity: isDisabled ? 0.6 : state.pressed ? 0.85 : 1,
          // Pequeña microinteracción: el botón "se hunde" levemente al presionar.
          transform: [{ scale: state.pressed && !isDisabled ? 0.98 : 1 }],
          width: fullWidth ? '100%' : undefined,
          ...sizeStyle,
        },
        typeof style === 'function' ? undefined : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} size="small" />
      ) : (
        <Text variant="bodyMedium" style={{ color: variantStyle.text }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
