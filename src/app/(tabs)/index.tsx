import { useMemo } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ListSkeleton } from '@/components/common/Skeleton';
import { PetCard } from '@/components/pets';
import { useSession } from '@/features/auth/hooks';
import { usePets } from '@/features/pets/hooks';
import { useVaccinesByPetIds } from '@/features/vaccines/hooks';
import { getVaccineStatus } from '@/utils/date';
import { colors, spacing } from '@/theme';
import type { Vaccine } from '@/types';

function getNextVaccineForPet(vaccines: Vaccine[], petId: string): Vaccine | null {
  const petVaccines = vaccines
    .filter((v) => v.petId === petId && v.nextDoseDate)
    .sort((a, b) => a.nextDoseDate!.localeCompare(b.nextDoseDate!));
  return petVaccines[0] ?? null;
}

export default function DashboardScreen() {
  const { user } = useSession();
  const petsQuery = usePets();
  const pets = petsQuery.data ?? [];
  const petIds = useMemo(() => pets.map((p) => p.id), [pets]);
  const vaccinesQuery = useVaccinesByPetIds(petIds);
  const vaccines = vaccinesQuery.data ?? [];

  const summary = useMemo(() => {
    const upcoming = vaccines.filter((v) => getVaccineStatus(v.nextDoseDate) === 'upcoming').length;
    const expired = vaccines.filter((v) => getVaccineStatus(v.nextDoseDate) === 'expired').length;
    return { totalPets: pets.length, totalVaccines: vaccines.length, upcoming, expired };
  }, [pets, vaccines]);

  if (petsQuery.isError) {
    return (
      <ScreenContainer>
        <ErrorState onRetry={() => petsQuery.refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View style={{ gap: spacing.xl }}>
        <Animated.View entering={FadeIn.duration(300)}>
          <Text variant="overline" color="tertiary">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <Text variant="h1">Hola, {user?.firstName} 👋</Text>
        </Animated.View>

        {petsQuery.isLoading ? (
          <ListSkeleton count={1} />
        ) : (
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <SummaryStat label="Mascotas" value={summary.totalPets} />
            <SummaryStat label="Vacunas" value={summary.totalVaccines} />
            <SummaryStat label="Próximas" value={summary.upcoming} tone="warning" />
            <SummaryStat label="Vencidas" value={summary.expired} tone="danger" />
          </View>
        )}

        <View>
          <SectionHeader title="Tus mascotas" action={{ label: 'Ver todas', onPress: () => router.push('/(tabs)/pets') }} />

          {petsQuery.isLoading ? (
            <ListSkeleton count={2} />
          ) : pets.length === 0 ? (
            <Card padding="sm">
              <EmptyState
                icon="🐾"
                title="Todavía no tienes mascotas"
                description="Agrega tu primera mascota para comenzar a llevar su cartilla de vacunación digital."
                actionLabel="+ Agregar mascota"
                onAction={() => router.push('/pets/create')}
              />
            </Card>
          ) : (
            <View style={{ gap: spacing.md }}>
              {pets.map((pet, index) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  nextVaccine={getNextVaccineForPet(vaccines, pet.id)}
                  onPress={() => router.push({ pathname: '/pets/[id]', params: { id: pet.id } })}
                  index={index}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'warning' | 'danger';
}) {
  const valueColor =
    tone === 'danger' ? colors.status.danger : tone === 'warning' ? colors.status.warning : colors.text.primary;

  return (
    <Card style={{ flex: 1, alignItems: 'center', gap: spacing.xs }} padding="md">
      <Text variant="h2" style={{ color: valueColor }}>
        {value}
      </Text>
      <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
        {label}
      </Text>
    </Card>
  );
}
