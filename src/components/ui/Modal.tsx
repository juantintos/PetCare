import { type ReactNode } from 'react';
import { Modal as RNModal, Pressable, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Qué es: modal centrado genérico (overlay + card blanca).
 * Por qué lo usamos: base para ConfirmDialog y, a futuro, cualquier otro
 * diálogo (selector de especie, etc.) sin repetir la lógica de overlay.
 */
export function Modal({ visible, onClose, children }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: spacing.xl,
            width: '100%',
            maxWidth: 400,
          }}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
