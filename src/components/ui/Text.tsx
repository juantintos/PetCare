import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { colors, textVariants, type TextVariant } from '@/theme';

/**
 * Qué es: wrapper sobre <Text> de React Native con variantes semánticas.
 * Por qué lo usamos: en vez de escribir `style={{ fontSize: 20, fontFamily: ... }}`
 * en cada pantalla, se elige una variante ("h2", "caption") que ya trae la
 * combinación correcta de tamaño/familia/línea definida en theme/typography.ts.
 * Qué problema resuelve: garantiza jerarquía visual consistente y hace que
 * cambiar "todos los h2 de la app" sea un cambio de una sola línea.
 */
export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: keyof typeof colors.text | string;
}

export function Text({ variant = 'body', color = 'primary', style, ...props }: TextProps) {
  const resolvedColor =
    color in colors.text ? colors.text[color as keyof typeof colors.text] : color;

  return (
    <RNText
      style={[textVariants[variant], { color: resolvedColor }, style]}
      // Buena práctica de accesibilidad: permite que el usuario escale el
      // texto desde la configuración del sistema sin romper el layout.
      allowFontScaling
      {...props}
    />
  );
}
