import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/theme';

export interface EmptyStateProps {
  icon: string; // emoji, mantiene el componente simple sin depender de una librería de íconos aquí
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Qué es: pantalla/sección que reemplaza una lista vacía por una invitación
 * a actuar (ver punto 11 y 23 del brief: "no mostrar simplemente una lista vacía").
 * Por qué lo usamos: mejora enormemente la primera experiencia del usuario y
 * evita que la app se sienta "rota" cuando aún no hay datos.
 * Qué problema resuelve: reutilizable para mascotas vacías, vacunas vacías,
 * resultados de búsqueda vacíos, etc. — solo cambia el texto y el ícono.
 */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        paddingVertical: spacing['4xl'],
        paddingHorizontal: spacing.xl,
      }}
    >
      <Text style={{ fontSize: 48 }}>{icon}</Text>
      <Text variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <View style={{ marginTop: spacing.md, width: '100%' }}>
          <Button label={actionLabel} onPress={onAction} fullWidth />
        </View>
      )}
    </View>
  );
}
