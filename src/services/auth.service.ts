import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';
import { AppError } from '@/utils/errors';
import { simulateNetworkDelay } from './api';
import {
  mockHash,
  readUsersDb,
  toPublicUser,
  writeUsersDb,
  type StoredMockUser,
} from './_mockUsersRepository';

/**
 * Qué es: servicio de autenticación MOCK. Cumple exactamente el mismo
 * contrato (mismas firmas de función) que tendría `auth.service.ts` contra
 * un backend real.
 * Por qué lo usamos: permite construir y probar toda la UI de auth sin
 * depender de un backend, y el día que exista uno, solo se reemplaza el
 * CONTENIDO de estas funciones — ninguna pantalla ni hook cambia.
 * Qué problema resuelve: desacopla UI de infraestructura (punto 15 del brief).
 *
 * El acceso a la "tabla" de usuarios vive en `_mockUsersRepository.ts`,
 * compartido con `profile.service.ts` (ver ese archivo para más contexto).
 */

function generateId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateToken(userId: string): string {
  return `mock_token_${userId}_${Date.now()}`;
}

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    await simulateNetworkDelay();

    const users = await readUsersDb();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found || found.passwordHash !== mockHash(password)) {
      throw new AppError({ message: 'Credenciales inválidas', code: 'INVALID_CREDENTIALS' });
    }

    return { user: toPublicUser(found), token: generateToken(found.id) };
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await simulateNetworkDelay();

    const users = await readUsersDb();
    const exists = users.some((u) => u.email.toLowerCase() === credentials.email.toLowerCase());

    if (exists) {
      throw new AppError({ message: 'El correo ya está registrado', code: 'EMAIL_ALREADY_EXISTS' });
    }

    const now = new Date().toISOString();
    const newUser: StoredMockUser = {
      id: generateId(),
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      avatarUrl: null,
      createdAt: now,
      updatedAt: now,
      passwordHash: mockHash(credentials.password),
    };

    await writeUsersDb([...users, newUser]);

    return { user: toPublicUser(newUser), token: generateToken(newUser.id) };
  },

  async logout(): Promise<void> {
    await simulateNetworkDelay(200);
    // En un backend real, aquí se invalidaría el token del lado del servidor.
  },
};
