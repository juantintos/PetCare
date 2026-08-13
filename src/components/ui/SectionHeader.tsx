import { View } from 'react-native';
import { Text } from './Text';
import { spacing } from '@/theme';

export interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
      }}
    >
      <Text variant="h3">{title}</Text>
      {action && (
        <Text variant="label" style={{ color: '#3F7D6E' }} onPress={action.onPress}>
          {action.label}
        </Text>
      )}
    </View>
  );
}
