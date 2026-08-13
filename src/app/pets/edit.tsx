import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { PetForm } from '@/components/pets/PetForm';
import { usePet, useUpdatePet } from '@/features/pets/hooks';
import { useToast } from '@/components/common/Toast';
import { spacing } from '@/theme';
import type { PetFormValues } from '@/features/pets/schemas/pet.schema';
import type { UpdatePetInput } from '@/types';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petQuery = usePet(id);
  const updatePet = useUpdatePet(id!);
  const { showToast } = useToast();

  if (petQuery.isLoading) {
    return (
      <ScreenContainer edges={['bottom']}>
        <LoadingState message="Cargando mascota..." />
      </ScreenContainer>
    );
  }

  if (petQuery.isError || !petQuery.data) {
    return (
      <ScreenContainer edges={['bottom']}>
        <ErrorState onRetry={() => petQuery.refetch()} />
      </ScreenContainer>
    );
  }

  const pet = petQuery.data;

  const handleSubmit = (values: PetFormValues) => {
    const input: UpdatePetInput = {
      name: values.name,
      species: values.species,
      breed: values.breed || null,
      gender: values.gender,
      birthDate: values.birthDate,
      weight: values.weight ? Number(values.weight) : null,
      notes: values.notes || null,
    };

    updatePet.mutate(input, {
      onSuccess: () => {
        showToast('Cambios guardados correctamente');
        router.back();
      },
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  return (
    <ScreenContainer scrollable edges={['bottom']}>
      <View style={{ gap: spacing.xl, paddingVertical: spacing.lg }}>
        <Text variant="h1">Editar a {pet.name}</Text>

        <PetForm
          defaultValues={{
            name: pet.name,
            species: pet.species,
            breed: pet.breed ?? '',
            gender: pet.gender,
            birthDate: pet.birthDate,
            weight: pet.weight ? String(pet.weight) : '',
            notes: pet.notes ?? '',
          }}
          onSubmit={handleSubmit}
          submitLabel="Guardar cambios"
          submitting={updatePet.isPending}
        />
      </View>
    </ScreenContainer>
  );
}
