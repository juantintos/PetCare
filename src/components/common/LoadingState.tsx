import { ActivityIndicator, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/theme';

export interface LoadingStateProps {
  message?: string;
}

/**
 * Qué es: indicador de carga estándar para pantallas completas o secciones.
 * Por qué lo usamos: en la Fase 5 reemplazaremos esto por skeletons más
 * elaborados en listas específicas, pero para estados de carga genéricos
 * (login, guardar formulario) un spinner centralizado es suficiente y
 * consistente.
 */
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      {message && (
        <Text variant="body" color="secondary">
          {message}
        </Text>
      )}
    </View>
  );
}
