import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';

/**
 * Qué es: acceso compartido a la "tabla" de usuarios del mock.
 * Por qué lo usamos: tanto `auth.service.ts` (login/registro) como
 * `profile.service.ts` (editar perfil/contraseña) necesitan leer y escribir
 * los mismos usuarios. Sin este archivo, cada uno reimplementaría
 * `readUsersDb`/`writeUsersDb`/`mockHash` — justo la duplicación que el
 * brief pide evitar (DRY, punto 26).
 *
 * Este archivo es un detalle de implementación del mock: NO se importa
 * desde features/ ni desde pantallas, solo desde otros archivos en
 * `services/`. Cuando exista backend real, este archivo completo desaparece
 * sin afectar a auth.service.ts ni profile.service.ts en su forma pública.
 */

const MOCK_USERS_KEY = 'petcare_mock_users_db';

export interface StoredMockUser extends User {
  passwordHash: string;
}

export function mockHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export function toPublicUser({ passwordHash: _passwordHash, ...user }: StoredMockUser): User {
  return user;
}

export async function readUsersDb(): Promise<StoredMockUser[]> {
  const raw = await AsyncStorage.getItem(MOCK_USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredMockUser[]) : [];
}

export async function writeUsersDb(users: StoredMockUser[]): Promise<void> {
  await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}
