import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

export interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  padded?: boolean;
}

/**
 * Qué es: wrapper estándar para el contenido de cada pantalla.
 * Por qué lo usamos: sin esto, cada pantalla tendría que repetir
 * SafeAreaView + padding + color de fondo, y sería fácil que una pantalla
 * quede "distinta" a las demás por olvido.
 * Qué problema resuelve: unifica el fondo, el padding y el manejo de safe
 * areas (notch, home indicator) en un solo lugar.
 */
export function ScreenContainer({
  children,
  scrollable = false,
  edges = ['top', 'bottom'],
  padded = true,
}: ScreenContainerProps) {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.background }}>
      <Container
        style={scrollable ? undefined : { flex: 1, padding: padded ? spacing.lg : 0 }}
        contentContainerStyle={
          scrollable ? { padding: padded ? spacing.lg : 0, flexGrow: 1 } : undefined
        }
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}
