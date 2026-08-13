/**
 * Qué es: valores de border-radius centralizados.
 * Por qué lo usamos: los bordes redondeados son parte importante del look
 * "confianza + cuidado" que buscamos (menos agresivo que esquinas rectas).
 * Qué problema resuelve: mantiene consistente el "redondeo" entre botones,
 * cards, inputs y modales.
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
