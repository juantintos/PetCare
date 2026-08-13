import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { VaccineForm } from '@/components/vaccines';
import { useCreateVaccine } from '@/features/vaccines/hooks';
import { useToast } from '@/components/common/Toast';
import { spacing } from '@/theme';
import type { VaccineFormValues } from '@/features/vaccines/schemas/vaccine.schema';
import type { CreateVaccineInput } from '@/types';

export default function CreateVaccineScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const createVaccine = useCreateVaccine(petId!);
  const { showToast } = useToast();

  const handleSubmit = (values: VaccineFormValues) => {
    const input: CreateVaccineInput = {
      petId: petId!,
      name: values.name,
      applicationDate: values.applicationDate,
      nextDoseDate: values.nextDoseDate || null,
      veterinarian: values.veterinarian || null,
      clinic: values.clinic || null,
      batchNumber: values.batchNumber || null,
      notes: values.notes || null,
    };

    createVaccine.mutate(input, {
      onSuccess: () => {
        showToast('Vacuna registrada correctamente 💉');
        router.back();
      },
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  return (
    <ScreenContainer scrollable edges={['bottom']}>
      <View style={{ gap: spacing.xl, paddingVertical: spacing.lg }}>
        <Text variant="h1">Agregar vacuna</Text>
        <VaccineForm onSubmit={handleSubmit} submitLabel="Guardar vacuna" submitting={createVaccine.isPending} />
      </View>
    </ScreenContainer>
  );
}
