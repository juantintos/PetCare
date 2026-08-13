import { View } from 'react-native';
import { Modal } from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/theme';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Qué es: diálogo de confirmación reutilizable para acciones destructivas.
 * Por qué lo usamos: el brief pide confirmación antes de eliminar tanto
 * mascotas (punto 5) como vacunas (punto 8) — un solo componente para
 * ambos casos, en vez de duplicar el diálogo.
 */
export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Eliminar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} onClose={onCancel}>
      <View style={{ gap: spacing.md }}>
        <Text variant="h3">{title}</Text>
        <Text variant="body" color="secondary">
          {description}
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button label="Cancelar" variant="outline" onPress={onCancel} fullWidth disabled={loading} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label={confirmLabel} variant="danger" onPress={onConfirm} fullWidth loading={loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
