/**
 * Qué es: escala de espaciado basada en múltiplos de 4.
 * Por qué lo usamos: usar valores libres (7px, 13px, 22px...) por toda la app
 * genera una interfaz que "se siente" desalineada aunque el usuario no sepa
 * decir por qué. Una escala fija fuerza consistencia visual.
 * Qué problema resuelve: todos los paddings/margins/gaps salen del mismo
 * sistema, lo que hace que cards, formularios y listas se vean como parte de
 * un mismo producto.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export type SpacingToken = keyof typeof spacing;
