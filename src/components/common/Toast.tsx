import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';

type ToastTone = 'success' | 'error' | 'info';

interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneColors: Record<ToastTone, string> = {
  success: colors.status.success,
  error: colors.status.danger,
  info: colors.primary.DEFAULT,
};

/**
 * Qué es: sistema de notificaciones "toast" (mensajes temporales flotantes).
 * Por qué un Context y no un componente por pantalla: un toast debe poder
 * mostrarse aunque el usuario acabe de navegar a otra pantalla (ej. "Mascota
 * eliminada" mientras se hace la transición de vuelta a la lista) — por eso
 * vive en la raíz de la app, no dentro de cada pantalla.
 * Qué problema resuelve: feedback consistente al guardar/eliminar (punto 12
 * del brief) sin que cada pantalla reinvente su propio mensaje flotante.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now();
    setToast({ id, message, tone });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          entering={FadeInDown.duration(220)}
          exiting={FadeOutDown.duration(180)}
          style={{
            position: 'absolute',
            bottom: spacing['4xl'],
            left: spacing.xl,
            right: spacing.xl,
          }}
          pointerEvents="none"
        >
          <View
            style={{
              backgroundColor: colors.text.primary,
              borderRadius: radius.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: radius.full,
                backgroundColor: toneColors[toast.tone],
              }}
            />
            <Text variant="bodyMedium" style={{ color: colors.text.inverse, flex: 1 }}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>');
  }
  return context;
}
