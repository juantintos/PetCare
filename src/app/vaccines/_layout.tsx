import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function VaccinesLayout() {
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
      <Stack.Screen name="create" options={{ title: 'Agregar vacuna' }} />
      <Stack.Screen name="edit" options={{ title: 'Editar vacuna' }} />
    </Stack>
  );
}
