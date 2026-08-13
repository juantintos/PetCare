import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { FormInput, PasswordInput } from '@/components/forms';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { useLogin } from '@/features/auth/hooks';
import { spacing } from '@/theme';

export default function LoginScreen() {
  const login = useLogin();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = (values: LoginFormValues) => {
    // El hook ya maneja loading/error/éxito — la pantalla solo dispara la
    // acción con los valores validados por Zod.
    login.mutate(values);
  };

  return (
    <ScreenContainer scrollable>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing['2xl'] }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="overline" color="tertiary">
            PETCARE
          </Text>
          <Text variant="h1">Bienvenido de vuelta 👋</Text>
          <Text variant="body" color="secondary">
            Inicia sesión para ver la cartilla de tus mascotas.
          </Text>
        </View>

        <View style={{ gap: spacing.lg }}>
          <FormInput
            control={control}
            name="email"
            label="Correo electrónico"
            placeholder="tu@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <PasswordInput
            control={control}
            name="password"
            label="Contraseña"
            placeholder="••••••••"
          />

          <Link href="/(auth)/forgot-password" asChild>
            <Text variant="caption" style={{ alignSelf: 'flex-end', color: '#3F7D6E' }}>
              ¿Olvidaste tu contraseña?
            </Text>
          </Link>

          {login.isError && (
            <Text variant="caption" style={{ color: '#E4572E' }}>
              {login.error.message}
            </Text>
          )}

          <Button
            label="Iniciar sesión"
            onPress={handleSubmit(onSubmit)}
            loading={login.isPending}
            fullWidth
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
          <Text variant="body" color="secondary">
            ¿No tienes cuenta?
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: '#3F7D6E' }}
            onPress={() => router.push('/(auth)/register')}
          >
            Regístrate
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
