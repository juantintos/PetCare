/**
 * Qué es: helper mínimo para concatenar nombres de clases condicionalmente,
 * pensado para usarse con className en componentes NativeWind.
 * Por qué lo usamos: evita template strings frágiles como
 * `className={`base ${isActive ? 'activo' : ''}`}` que generan espacios
 * dobles o clases vacías.
 * Qué problema resuelve: una única función pequeña, sin dependencias
 * externas (no se necesita `clsx` para este nivel de complejidad — KISS).
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
