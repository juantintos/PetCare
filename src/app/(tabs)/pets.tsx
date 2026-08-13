import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ListSkeleton } from '@/components/common/Skeleton';
import { PetCard } from '@/components/pets';
import { usePets } from '@/features/pets/hooks';
import { spacing } from '@/theme';

export default function PetsScreen() {
  const petsQuery = usePets();
  const pets = petsQuery.data ?? [];

  return (
    <ScreenContainer scrollable={pets.length > 0}>
      <View style={{ gap: spacing.lg, flex: pets.length > 0 ? undefined : 1 }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text variant="h1">Mis mascotas</Text>
          {pets.length > 0 && (
            <Button label="+ Agregar" size="sm" onPress={() => router.push('/pets/create')} />
          )}
        </View>

        {petsQuery.isLoading ? (
          <ListSkeleton count={4} />
        ) : petsQuery.isError ? (
          <ErrorState onRetry={() => petsQuery.refetch()} />
        ) : pets.length === 0 ? (
          <EmptyState
            icon="🐾"
            title="Todavía no tienes mascotas"
            description="Agrega tu primera mascota para comenzar a llevar su cartilla de vacunación digital."
            actionLabel="+ Agregar mascota"
            onAction={() => router.push('/pets/create')}
          />
        ) : (
          <View style={{ gap: spacing.md }}>
            {pets.map((pet, index) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onPress={() => router.push({ pathname: '/pets/[id]', params: { id: pet.id } })}
                index={index}
              />
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
