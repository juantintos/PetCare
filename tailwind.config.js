/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/features/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Estos valores se mantienen sincronizados manualmente con src/theme/colors.ts
        // porque NativeWind (clases) y los objetos JS (estilos dinámicos, SVGs, iconos)
        // necesitan la misma fuente de verdad. Es la única duplicación intencional del proyecto.
        primary: {
          DEFAULT: '#3F7D6E',
          light: '#E8F3EF',
          dark: '#2C5A4F',
        },
        accent: {
          DEFAULT: '#F2A65A',
          light: '#FDEEDC',
        },
        success: '#4C9A6B',
        warning: '#F2A65A',
        danger: '#E4572E',
        background: '#FAFAF8',
        surface: '#FFFFFF',
        border: '#E6E4DF',
        text: {
          primary: '#1F2A27',
          secondary: '#667169',
          tertiary: '#9AA39C',
        },
      },
      fontFamily: {
        display: ['Sora_600SemiBold'],
        'display-bold': ['Sora_700Bold'],
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semibold': ['Inter_600SemiBold'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
