/**
 * Paleta de colores de PetCare.
 *
 * Qué es: la única fuente de verdad para colores en TODO el proyecto.
 * Por qué lo usamos: si el color viniera hardcodeado ("#3F7D6E") dentro de cada
 * componente, cambiar el color primario de la app implicaría buscar y reemplazar
 * en decenas de archivos, con alto riesgo de inconsistencias visuales.
 * Qué problema resuelve: centraliza la identidad visual, permite themes
 * (claro/oscuro a futuro) y hace que cualquier cambio de marca sea de bajo riesgo.
 *
 * Nota: estos valores están duplicados intencionalmente en `tailwind.config.js`
 * porque NativeWind necesita las clases disponibles en tiempo de compilación,
 * mientras que este objeto se usa para estilos dinámicos, iconos y SVGs donde
 * no podemos usar className (p. ej. `color={colors.primary.DEFAULT}` en un ícono).
 */

export const colors = {
  primary: {
    DEFAULT: '#3F7D6E', // Verde salvia: salud, calma, confianza
    light: '#E8F3EF',
    dark: '#2C5A4F',
  },
  accent: {
    DEFAULT: '#F2A65A', // Ámbar cálido: cercanía, mascotas, calidez
    light: '#FDEEDC',
  },
  status: {
    success: '#4C9A6B', // Vacuna aplicada
    warning: '#F2A65A', // Vacuna próxima
    danger: '#E4572E', // Vacuna vencida
  },
  background: '#FAFAF8',
  surface: '#FFFFFF',
  border: '#E6E4DF',
  text: {
    primary: '#1F2A27',
    secondary: '#667169',
    tertiary: '#9AA39C',
    inverse: '#FFFFFF',
  },
  overlay: 'rgba(15, 23, 21, 0.5)',
} as const;

export type ColorToken = typeof colors;
