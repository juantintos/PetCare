import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/theme';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Qué es: estado de error genérico y amigable.
 * Por qué lo usamos: el brief (punto 19) exige que los errores técnicos
 * (AxiosError, network error, etc.) nunca lleguen tal cual al usuario.
 * Este componente recibe siempre un mensaje ya traducido a lenguaje humano
 * por la capa de manejo de errores (Fase 3+), nunca el error crudo.
 */
export function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos completar esta acción. Inténtalo de nuevo.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.xl,
      }}
    >
      <Text style={{ fontSize: 40 }}>⚠️</Text>
      <Text variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
        {description}
      </Text>
      {onRetry && (
        <View style={{ marginTop: spacing.md }}>
          <Button label="Reintentar" variant="outline" onPress={onRetry} />
        </View>
      )}
    </View>
  );
}
