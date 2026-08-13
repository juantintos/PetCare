import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { FormInput, ChipSelect } from '@/components/forms';
import {
  petFormSchema,
  petSpeciesOptions,
  petGenderOptions,
  type PetFormValues,
} from '@/features/pets/schemas/pet.schema';
import { spacing } from '@/theme';

export interface PetFormProps {
  defaultValues?: Partial<PetFormValues>;
  onSubmit: (values: PetFormValues) => void;
  submitLabel: string;
  submitting?: boolean;
}

/**
 * Qué es: formulario de mascota compartido entre `pets/create.tsx` y
 * `pets/edit.tsx`.
 * Por qué lo usamos: ambas pantallas piden EXACTAMENTE los mismos campos —
 * lo único que cambia es qué se hace con los valores al enviar (crear vs.
 * actualizar) y los valores iniciales. Extraer el formulario evita
 * duplicar ~80 líneas de JSX (DRY, punto 26 del brief).
 */
export function PetForm({ defaultValues, onSubmit, submitLabel, submitting }: PetFormProps) {
  const { control, handleSubmit } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: '',
      species: 'dog',
      breed: '',
      gender: 'unknown',
      birthDate: '',
      weight: '',
      notes: '',
      ...defaultValues,
    },
  });

  return (
    <View style={{ gap: spacing.lg }}>
      <FormInput control={control} name="name" label="Nombre" placeholder="Max" />
      <ChipSelect control={control} name="species" label="Especie" options={petSpeciesOptions} />
      <ChipSelect control={control} name="gender" label="Sexo" options={petGenderOptions} />
      <FormInput
        control={control}
        name="breed"
        label="Raza (opcional)"
        placeholder="Golden Retriever"
      />
      <FormInput
        control={control}
        name="birthDate"
        label="Fecha de nacimiento"
        placeholder="AAAA-MM-DD"
        keyboardType="numbers-and-punctuation"
      />
      <FormInput
        control={control}
        name="weight"
        label="Peso en kg (opcional)"
        placeholder="12.5"
        keyboardType="decimal-pad"
      />
      <FormInput
        control={control}
        name="notes"
        label="Notas (opcional)"
        placeholder="Alergias, comportamiento, etc."
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={submitting} fullWidth />
    </View>
  );
}
