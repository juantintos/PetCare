import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/Skeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/components/common/Toast';
import { VaccineCard } from '@/components/vaccines';
import { usePet, useDeletePet } from '@/features/pets/hooks';
import { useVaccinesByPet } from '@/features/vaccines/hooks';
import { calculateAge, formatDate } from '@/utils/date';
import { petGenderOptions, petSpeciesOptions } from '@/features/pets/schemas/pet.schema';
import { spacing } from '@/theme';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const petQuery = usePet(id);
  const vaccinesQuery = useVaccinesByPet(id);
  const deletePet = useDeletePet();
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
        <ErrorState
          title="No encontramos esta mascota"
          onRetry={() => petQuery.refetch()}
        />
      </ScreenContainer>
    );
  }

  const pet = petQuery.data;
  const vaccines = vaccinesQuery.data ?? [];
  const speciesLabel = petSpeciesOptions.find((s) => s.value === pet.species);
  const genderLabel = petGenderOptions.find((g) => g.value === pet.gender)?.label;

  const handleDelete = () => {
    deletePet.mutate(pet.id, {
      onSuccess: () => {
        showToast(`${pet.name} fue eliminada`);
        router.replace('/(tabs)/pets');
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
        <View style={{ alignItems: 'center', gap: spacing.md }}>
          <Avatar uri={pet.photo} name={pet.name} size={96} />
          <Text variant="h1">
            {speciesLabel?.icon} {pet.name}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Editar" size="sm" variant="outline" onPress={() => router.push({ pathname: '/pets/edit', params: { id: pet.id } })} />
            <Button label="Eliminar" size="sm" variant="ghost" onPress={() => setShowDeleteDialog(true)} />
          </View>
        </View>

        <Card style={{ gap: spacing.sm }}>
          <InfoRow label="Especie" value={speciesLabel?.label ?? '—'} />
          <InfoRow label="Raza" value={pet.breed || 'No especificada'} />
          <InfoRow label="Edad" value={calculateAge(pet.birthDate)} />
          <InfoRow label="Sexo" value={genderLabel ?? '—'} />
          <InfoRow label="Peso" value={pet.weight ? `${pet.weight} kg` : 'No especificado'} />
          {pet.notes && <InfoRow label="Notas" value={pet.notes} />}
        </Card>

        <View>
          <SectionHeader
            title="Cartilla de vacunación"
            action={{
              label: '+ Agregar',
              onPress: () => router.push({ pathname: '/vaccines/create', params: { petId: pet.id } }),
            }}
          />

          {vaccinesQuery.isLoading ? (
            <ListSkeleton count={2} />
          ) : vaccinesQuery.isError ? (
            <ErrorState onRetry={() => vaccinesQuery.refetch()} />
          ) : vaccines.length === 0 ? (
            <Card padding="sm">
              <EmptyState
                icon="💉"
                title="Sin vacunas registradas"
                description={`Registra la primera vacuna de ${pet.name} para empezar su cartilla digital.`}
                actionLabel="+ Agregar vacuna"
                onAction={() => router.push({ pathname: '/vaccines/create', params: { petId: pet.id } })}
              />
            </Card>
          ) : (
            <View style={{ gap: spacing.md }}>
              {vaccines.map((vaccine, index) => (
                <VaccineCard
                  key={vaccine.id}
                  vaccine={vaccine}
                  index={index}
                  onPress={() =>
                    router.push({ pathname: '/vaccines/edit', params: { id: vaccine.id, petId: pet.id } })
                  }
                />
              ))}
            </View>
          )}
        </View>
      </View>

      <ConfirmDialog
        visible={showDeleteDialog}
        title={`¿Eliminar a ${pet.name}?`}
        description="Se eliminará también todo su historial de vacunas. Esta acción no se puede deshacer."
        loading={deletePet.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
      <Text variant="body" color="secondary">
        {label}
      </Text>
      <Text variant="bodyMedium" style={{ flex: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}
