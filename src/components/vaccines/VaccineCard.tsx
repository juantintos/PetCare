import { Pressable, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { spacing } from '@/theme';
import { formatDate, getVaccineStatus } from '@/utils/date';
import type { Vaccine, VaccineStatus } from '@/types';

export interface VaccineCardProps {
  vaccine: Vaccine;
  onPress: () => void;
  index?: number;
}

const STATUS_META: Record<VaccineStatus, { label: string; tone: BadgeTone }> = {
  applied: { label: 'Aplicada', tone: 'success' },
  upcoming: { label: 'Próxima', tone: 'warning' },
  expired: { label: 'Vencida', tone: 'danger' },
};

/**
 * Qué es: card de una vacuna dentro de la cartilla de vacunación.
 * Por qué el estado nunca se comunica solo con color: cada Badge combina
 * color + texto ("Vencida", no solo un punto rojo) — accesibilidad
 * (punto 13 del brief).
 */
export function VaccineCard({ vaccine, onPress, index = 0 }: VaccineCardProps) {
  const status = getVaccineStatus(vaccine.nextDoseDate);
  const meta = STATUS_META[status];

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).duration(250)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de la vacuna ${vaccine.name}`}
      >
        {({ pressed }) => (
          <Card style={{ opacity: pressed ? 0.9 : 1, gap: spacing.sm }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Text variant="bodyMedium" style={{ flex: 1 }}>
                {vaccine.name}
              </Text>
              <Badge label={meta.label} tone={meta.tone} />
            </View>

            <Text variant="caption" color="secondary">
              Aplicada: {formatDate(vaccine.applicationDate)}
            </Text>

            {vaccine.nextDoseDate && (
              <Text variant="caption" color="secondary">
                Próxima dosis: {formatDate(vaccine.nextDoseDate)}
              </Text>
            )}

            {(vaccine.veterinarian || vaccine.clinic) && (
              <Text variant="caption" color="tertiary">
                {[vaccine.veterinarian, vaccine.clinic].filter(Boolean).join(' · ')}
              </Text>
            )}
          </Card>
        )}
      </Pressable>
    </Animated.View>
  );
}
