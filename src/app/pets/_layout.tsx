import { Stack } from 'expo-router';
import { colors } from '@/theme';

/**
 * Qué es: Stack con header nativo para las pantallas de mascota que se
 * empujan desde los tabs (crear, editar, detalle).
 * Por qué headerShown: true aquí (a diferencia del Stack raíz): estas
 * pantallas necesitan el botón "atrás" nativo — a diferencia de
 * login/register que navegan lateralmente entre sí sin jerarquía de "volver".
 */
export default function PetsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text.primary,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="create" options={{ title: 'Agregar mascota' }} />
      <Stack.Screen name="edit" options={{ title: 'Editar mascota' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
