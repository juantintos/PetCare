import { Pressable, View } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Text } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';

export interface ChipSelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface ChipSelectProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  options: readonly ChipSelectOption[];
}

/**
 * Qué es: selector de una sola opción presentado como "chips" horizontales.
 * Por qué lo usamos (en vez de un <Picker> nativo): para 2-4 opciones, un
 * picker nativo agrega un paso extra (abrir el selector) sin necesidad —
 * los chips muestran todas las opciones de un vistazo y se seleccionan con
 * un solo toque, mejor UX para este caso concreto (especie: 3 opciones,
 * sexo: 3 opciones).
 */
export function ChipSelect<TFormValues extends FieldValues>({
  control,
  name,
  label,
  options,
}: ChipSelectProps<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ gap: spacing.xs }}>
          <Text variant="label" color="secondary">
            {label}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onChange(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.xs,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.lg,
                    borderRadius: radius.full,
                    borderWidth: 1.5,
                    borderColor: isSelected ? colors.primary.DEFAULT : colors.border,
                    backgroundColor: isSelected ? colors.primary.light : colors.surface,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  {option.icon && <Text>{option.icon}</Text>}
                  <Text
                    variant="bodyMedium"
                    style={{ color: isSelected ? colors.primary.dark : colors.text.secondary }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
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
