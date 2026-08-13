import { View } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { FormInput, PasswordInput } from '@/components/forms';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth.schema';
import { useRegister } from '@/features/auth/hooks';
import { spacing } from '@/theme';

export default function RegisterScreen() {
  const register = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const onSubmit = (values: RegisterFormValues) => {
    register.mutate(values);
  };

  return (
    <ScreenContainer scrollable>
      <View style={{ gap: spacing['2xl'], paddingVertical: spacing.xl }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="overline" color="tertiary">
            PETCARE
          </Text>
          <Text variant="h1">Crea tu cuenta 🐾</Text>
          <Text variant="body" color="secondary">
            Nunca más pierdas la cartilla de vacunación de tu mascota.
          </Text>
        </View>

        <View style={{ gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <FormInput control={control} name="firstName" label="Nombre" placeholder="Juan" />
            </View>
            <View style={{ flex: 1 }}>
              <FormInput control={control} name="lastName" label="Apellido" placeholder="Pérez" />
            </View>
          </View>

          <FormInput
            control={control}
            name="email"
            label="Correo electrónico"
            placeholder="tu@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <PasswordInput control={control} name="password" label="Contraseña" placeholder="Mínimo 8 caracteres" />
          <PasswordInput
            control={control}
            name="confirmPassword"
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
          />

          {register.isError && (
            <Text variant="caption" style={{ color: '#E4572E' }}>
              {register.error.message}
            </Text>
          )}

          <Button
            label="Crear cuenta"
            onPress={handleSubmit(onSubmit)}
            loading={register.isPending}
            fullWidth
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
          <Text variant="body" color="secondary">
            ¿Ya tienes cuenta?
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: '#3F7D6E' }}
            onPress={() => router.replace('/(auth)/login')}
          >
            Inicia sesión
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
