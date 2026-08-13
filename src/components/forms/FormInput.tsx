import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';

export interface FormInputProps<TFormValues extends FieldValues> extends Omit<
  TextInputProps,
  'value' | 'onChangeText'
> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
}

/**
 * Qué es: input de formulario que integra <Controller> de React Hook Form,
 * label, y mensaje de error debajo del campo — todo en un componente.
 * Por qué lo usamos: sin esto, CADA campo de CADA formulario repetiría el
 * boilerplate de Controller + estilos de error + label. Con este componente,
 * un campo de formulario es una sola línea declarativa.
 * Qué problema resuelve: consistencia visual de errores (punto 21 del
 * brief: "mostrar errores debajo del campo correspondiente") sin
 * duplicación de código.
 */
export function FormInput<TFormValues extends FieldValues>({
  control,
  name,
  label,
  style,
  ...inputProps
}: FormInputProps<TFormValues>) {
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
          <TextInput
            value={value ?? ''}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur();
            }}
            placeholderTextColor={colors.text.tertiary}
            accessibilityLabel={label}
            style={[
              {
                borderWidth: 1.5,
                borderColor: error
                  ? colors.status.danger
                  : isFocused
                    ? colors.primary.DEFAULT
                    : colors.border,
                borderRadius: radius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                fontSize: 16,
                fontFamily: 'Inter_400Regular',
                color: colors.text.primary,
                backgroundColor: colors.surface,
              },
              style,
            ]}
            {...inputProps}
          />
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
