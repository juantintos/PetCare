import { Pressable, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { colors, spacing } from '@/theme';
import { calculateAge, formatDateShort } from '@/utils/date';
import { petSpeciesOptions } from '@/features/pets/schemas/pet.schema';
import type { Pet, Vaccine } from '@/types';
import { getVaccineStatus } from '@/utils/date';

export interface PetCardProps {
  pet: Pet;
  nextVaccine?: Vaccine | null;
  onPress: () => void;
  index?: number;
}

const speciesIcon = (species: Pet['species']) =>
  petSpeciesOptions.find((o) => o.value === species)?.icon ?? '🐾';

/**
 * Qué es: card de mascota usada en el dashboard y en la lista de mascotas.
 * Por qué recibe `nextVaccine` por props en vez de calcularlo internamente:
 * mantiene el componente "tonto" (solo presenta lo que le dan) — la lógica
 * de "cuál es la próxima vacuna de esta mascota" vive en la pantalla que
 * ya tiene todas las vacunas cargadas (single responsibility).
 */
export function PetCard({ pet, nextVaccine, onPress, index = 0 }: PetCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 60).duration(300)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${pet.name}`}
      >
        {({ pressed }) => (
          <Card style={{ opacity: pressed ? 0.9 : 1, gap: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Avatar uri={pet.photoUrl} name={pet.name} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium">
                  {speciesIcon(pet.species)} {pet.name}
                </Text>
                <Text variant="caption" color="secondary">
                  {pet.breed || 'Raza no especificada'} · {calculateAge(pet.birthDate)}
                </Text>
              </View>
            </View>

            {nextVaccine?.nextDoseDate && (
              <View style={{ gap: spacing.xs }}>
                <Text variant="caption" color="tertiary">
                  Próxima vacuna
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Text variant="bodyMedium">{formatDateShort(nextVaccine.nextDoseDate)}</Text>
                  <Badge
                    label={
                      getVaccineStatus(nextVaccine.nextDoseDate) === 'expired'
                        ? 'Vencida'
                        : 'Próxima'
                    }
                    tone={
                      getVaccineStatus(nextVaccine.nextDoseDate) === 'expired'
                        ? 'danger'
                        : 'warning'
                    }
                  />
                </View>
              </View>
            )}

            <Text variant="label" style={{ color: colors.primary.DEFAULT }}>
              Ver detalles →
            </Text>
          </Card>
        )}
      </Pressable>
    </Animated.View>
  );
}
