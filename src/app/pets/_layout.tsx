import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function PetsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text.primary,
      }}
    >
      <Stack.Screen name="create" options={{ title: 'Agregar mascota' }} />
      <Stack.Screen name="edit" options={{ title: 'Editar mascota' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
