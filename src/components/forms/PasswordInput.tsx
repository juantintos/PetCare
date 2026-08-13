import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';

export interface PasswordInputProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
}

/**
 * Qué es: variante de FormInput especializada en contraseñas, con botón de
 * mostrar/ocultar.
 * Por qué un componente separado y no una prop `secure` en FormInput: el
 * ícono de mostrar/ocultar requiere su propio estado local (`showPassword`)
 * y layout (ícono absoluto dentro del input) — meter ese caso especial
 * dentro de FormInput lo haría más complejo para el 90% de los casos que no
 * son contraseña (composition over inheritance / SRP).
 */
export function PasswordInput<TFormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: PasswordInputProps<TFormValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={{ gap: spacing.xs }}>
          <Text variant="label" color="secondary">
            {label}
          </Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <TextInput
              value={value ?? ''}
              onChangeText={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              secureTextEntry={!showPassword}
              placeholder={placeholder}
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={label}
              style={{
                borderWidth: 1.5,
                borderColor: error
                  ? colors.status.danger
                  : isFocused
                    ? colors.primary.DEFAULT
                    : colors.border,
                borderRadius: radius.md,
                paddingVertical: spacing.md,
                paddingLeft: spacing.lg,
                paddingRight: spacing['3xl'],
                fontSize: 16,
                fontFamily: 'Inter_400Regular',
                color: colors.text.primary,
                backgroundColor: colors.surface,
              }}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={12}
              style={{ position: 'absolute', right: spacing.md }}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
          </View>
          {error?.message && (
            <Text variant="caption" style={{ color: colors.status.danger }}>
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
