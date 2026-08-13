/**
 * Qué es: escala tipográfica centralizada (familias, tamaños, pesos).
 * Por qué lo usamos: una jerarquía visual clara depende de usar SIEMPRE los
 * mismos tamaños para el mismo propósito (todos los títulos de sección con el
 * mismo tamaño, por ejemplo), en vez de que cada desarrollador elija "16 o 17px".
 * Qué problema resuelve: evita inconsistencias tipográficas y facilita ajustar
 * toda la app (p. ej. para accesibilidad) desde un solo lugar.
 *
 * Usamos dos familias con roles distintos:
 * - Sora (display): para títulos, con más carácter, usada con moderación.
 * - Inter (body): para texto de lectura larga, muy legible en pantallas chicas.
 */

export const fontFamily = {
  display: 'Sora_600SemiBold',
  displayBold: 'Sora_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 26,
  xl: 28,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
} as const;

/**
 * Variantes semánticas listas para usar en el componente <Text />.
 * En vez de combinar fontSize + fontFamily + lineHeight manualmente en cada
 * pantalla, se elige una variante por su propósito ("¿qué es este texto?").
 */
export const textVariants = {
  h1: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
  },
  h2: { fontFamily: fontFamily.display, fontSize: fontSize['2xl'], lineHeight: lineHeight['2xl'] },
  h3: { fontFamily: fontFamily.display, fontSize: fontSize.xl, lineHeight: lineHeight.xl },
  bodyLg: { fontFamily: fontFamily.body, fontSize: fontSize.lg, lineHeight: lineHeight.lg },
  body: { fontFamily: fontFamily.body, fontSize: fontSize.base, lineHeight: lineHeight.base },
  bodyMedium: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
  },
  caption: { fontFamily: fontFamily.body, fontSize: fontSize.sm, lineHeight: lineHeight.sm },
  label: { fontFamily: fontFamily.bodySemibold, fontSize: fontSize.sm, lineHeight: lineHeight.sm },
  overline: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
} as const;

export type TextVariant = keyof typeof textVariants;
