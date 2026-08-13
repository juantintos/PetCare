import { View, type ViewProps } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';

export interface CardProps extends ViewProps {
  padding?: keyof typeof spacing;
  elevated?: boolean;
}

/**
 * Qué es: contenedor base con fondo, bordes redondeados y sombra opcional.
 * Por qué lo usamos: las cards son el bloque visual más repetido de la app
 * (mascotas, vacunas, resúmenes del dashboard). Definir el estilo una sola
 * vez asegura que todas se vean parte del mismo sistema de diseño.
 */
export function Card({ padding = 'lg', elevated = true, style, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing[padding],
        },
        elevated && shadows.sm,
        style,
      ]}
      {...props}
    />
  );
}
