import { Image, View } from 'react-native';
import { Text } from './Text';
import { colors, radius } from '@/theme';

export interface AvatarProps {
  uri?: string | null;
  name: string;
  size?: number;
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/**
 * Qué es: avatar circular con foto o iniciales como fallback.
 * Por qué lo usamos: tanto el perfil de usuario como las mascotas necesitan
 * mostrar una foto opcional; el fallback de iniciales evita círculos vacíos
 * o ícono genérico de "imagen rota" cuando no hay foto.
 */
export function Avatar({ uri, name, size = 56 }: AvatarProps) {
  const commonStyle = {
    width: size,
    height: size,
    borderRadius: radius.full,
  };

  if (uri) {
    return <Image source={{ uri }} style={commonStyle} accessibilityLabel={`Foto de ${name}`} />;
  }

  return (
    <View
      style={[
        commonStyle,
        {
          backgroundColor: colors.primary.light,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      accessibilityLabel={`Iniciales de ${name}`}
    >
      <Text variant="bodyMedium" style={{ color: colors.primary.dark, fontSize: size / 2.5 }}>
        {getInitials(name) || '?'}
      </Text>
    </View>
  );
}
