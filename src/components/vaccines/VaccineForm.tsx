import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/forms';
import {
  vaccineFormSchema,
  type VaccineFormValues,
} from '@/features/vaccines/schemas/vaccine.schema';
import { spacing } from '@/theme';

export interface VaccineFormProps {
  defaultValues?: Partial<VaccineFormValues>;
  onSubmit: (values: VaccineFormValues) => void;
  submitLabel: string;
  submitting?: boolean;
}

export function VaccineForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitting,
}: VaccineFormProps) {
  const { control, handleSubmit } = useForm<VaccineFormValues>({
    resolver: zodResolver(vaccineFormSchema),
    defaultValues: {
      name: '',
      applicationDate: '',
      nextDoseDate: '',
      veterinarian: '',
      clinic: '',
      batchNumber: '',
      notes: '',
      ...defaultValues,
    },
  });

  return (
    <View style={{ gap: spacing.lg }}>
      <FormInput control={control} name="name" label="Nombre de la vacuna" placeholder="Rabia" />
      <FormInput
        control={control}
        name="applicationDate"
        label="Fecha de aplicación"
        placeholder="AAAA-MM-DD"
        keyboardType="numbers-and-punctuation"
      />
      <FormInput
        control={control}
        name="nextDoseDate"
        label="Próxima dosis (opcional)"
        placeholder="AAAA-MM-DD"
        keyboardType="numbers-and-punctuation"
      />
      <FormInput
        control={control}
        name="veterinarian"
        label="Veterinario (opcional)"
        placeholder="Dra. López"
      />
      <FormInput
        control={control}
        name="clinic"
        label="Clínica (opcional)"
        placeholder="Clínica San Roque"
      />
      <FormInput
        control={control}
        name="batchNumber"
        label="Número de lote (opcional)"
        placeholder="LT-2026-001"
      />
      <FormInput
        control={control}
        name="notes"
        label="Notas (opcional)"
        placeholder="Reacciones, observaciones, etc."
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={submitting} fullWidth />
    </View>
  );
}
