import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/forms';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/auth.schema';
import { spacing } from '@/theme';

/**
 * Nota educativa: esta pantalla valida el formulario end-to-end, pero el
 * ENVÍO real de un correo de recuperación requiere un backend (no tiene
 * sentido simularlo con un mock local, ya que implicaría "enviar" un email
 * real). Por eso aquí nos detenemos en un estado de confirmación visual —
 * la llamada real a `authService.requestPasswordReset()` se conecta cuando
 * exista backend (Fase 15 del brief).
 */
export default function ForgotPasswordScreen() {
  const [submitted, setSubmitted] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  if (submitted) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg, alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>📬</Text>
          <Text variant="h3" style={{ textAlign: 'center' }}>
            Revisa tu correo
          </Text>
          <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
            Si el correo existe en nuestro sistema, te enviamos instrucciones para recuperar tu
            contraseña.
          </Text>
          <Button label="Volver al inicio de sesión" variant="outline" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="h2">¿Olvidaste tu contraseña?</Text>
          <Text variant="body" color="secondary">
            Ingresa tu correo y te enviaremos instrucciones para recuperarla.
          </Text>
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

        <Button label="Enviar instrucciones" onPress={handleSubmit(() => setSubmitted(true))} fullWidth />
      </View>
    </ScreenContainer>
  );
}
