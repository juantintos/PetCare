import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { PetForm } from '@/components/pets/PetForm';
import { useCreatePet } from '@/features/pets/hooks';
import { useToast } from '@/components/common/Toast';
import { spacing } from '@/theme';
import type { PetFormValues } from '@/features/pets/schemas/pet.schema';
import type { CreatePetInput } from '@/types';

export default function CreatePetScreen() {
  const createPet = useCreatePet();
  const { showToast } = useToast();

  const handleSubmit = (values: PetFormValues) => {
    const input: CreatePetInput = {
      name: values.name,
      species: values.species,
      breed: values.breed || null,
      gender: values.gender,
      birthDate: values.birthDate,
      weight: values.weight ? Number(values.weight) : null,
      photoUrl: values.photoUrl ?? null,
      notes: values.notes || null,
    };

    createPet.mutate(input, {
      onSuccess: () => {
        showToast(`${values.name} fue agregada correctamente 🐾`);
        router.back();
      },
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  return (
    <ScreenContainer scrollable edges={['bottom']}>
      <View style={{ gap: spacing.xl, paddingVertical: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="h1">Agregar mascota</Text>
          <Text variant="body" color="secondary">
            Completa la información básica. Podrás editarla después.
          </Text>
        </View>

        <PetForm onSubmit={handleSubmit} submitLabel="Guardar mascota" submitting={createPet.isPending} />
      </View>
    </ScreenContainer>
  );
}
