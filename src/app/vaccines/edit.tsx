import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/common/Toast';
import { VaccineForm } from '@/components/vaccines';
import { useVaccine, useUpdateVaccine, useDeleteVaccine } from '@/features/vaccines/hooks';
import { spacing } from '@/theme';
import type { VaccineFormValues } from '@/features/vaccines/schemas/vaccine.schema';
import type { UpdateVaccineInput } from '@/types';

export default function EditVaccineScreen() {
  const { id, petId } = useLocalSearchParams<{ id: string; petId: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const vaccineQuery = useVaccine(id);
  const updateVaccine = useUpdateVaccine(id!, petId!);
  const deleteVaccine = useDeleteVaccine(petId!);
  const { showToast } = useToast();

  if (vaccineQuery.isLoading) {
    return (
      <ScreenContainer edges={['bottom']}>
        <LoadingState message="Cargando vacuna..." />
      </ScreenContainer>
    );
  }

  if (vaccineQuery.isError || !vaccineQuery.data) {
    return (
      <ScreenContainer edges={['bottom']}>
        <ErrorState onRetry={() => vaccineQuery.refetch()} />
      </ScreenContainer>
    );
  }

  const vaccine = vaccineQuery.data;

  const handleSubmit = (values: VaccineFormValues) => {
    const input: UpdateVaccineInput = {
      name: values.name,
      applicationDate: values.applicationDate,
      nextDoseDate: values.nextDoseDate || null,
      veterinarian: values.veterinarian || null,
      clinic: values.clinic || null,
      batchNumber: values.batchNumber || null,
      notes: values.notes || null,
    };

    updateVaccine.mutate(input, {
      onSuccess: () => {
        showToast('Vacuna actualizada correctamente');
        router.back();
      },
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  const handleDelete = () => {
    deleteVaccine.mutate(vaccine.id, {
      onSuccess: () => {
        showToast('Vacuna eliminada');
        router.back();
      },
      onError: (error) => {
        showToast(error.message, 'error');
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <ScreenContainer scrollable edges={['bottom']}>
      <View style={{ gap: spacing.xl, paddingVertical: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="h1">Editar vacuna</Text>
          <Button label="Eliminar" size="sm" variant="ghost" onPress={() => setShowDeleteDialog(true)} />
        </View>

        <VaccineForm
          defaultValues={{
            name: vaccine.name,
            applicationDate: vaccine.applicationDate,
            nextDoseDate: vaccine.nextDoseDate ?? '',
            veterinarian: vaccine.veterinarian ?? '',
            clinic: vaccine.clinic ?? '',
            batchNumber: vaccine.batchNumber ?? '',
            notes: vaccine.notes ?? '',
          }}
          onSubmit={handleSubmit}
          submitLabel="Guardar cambios"
          submitting={updateVaccine.isPending}
        />
      </View>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="¿Eliminar esta vacuna?"
        description="Esta acción no se puede deshacer."
        loading={deleteVaccine.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </ScreenContainer>
  );
}
