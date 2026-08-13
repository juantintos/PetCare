import type { User } from '@/types';
import { AppError } from '@/utils/errors';
import { simulateNetworkDelay } from './api';
import { mockHash, readUsersDb, toPublicUser, writeUsersDb } from './_mockUsersRepository';

export const profileService = {
  async updateProfile(userId: string, changes: Pick<User, 'firstName' | 'lastName'>): Promise<User> {
    await simulateNetworkDelay();
    const users = await readUsersDb();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      throw new AppError({ message: 'Usuario no encontrado', code: 'NOT_FOUND', status: 404 });
    }

    const updated = { ...users[index]!, ...changes, updatedAt: new Date().toISOString() };
    users[index] = updated;
    await writeUsersDb(users);

    return toPublicUser(updated);
  },

  async changePassword(
    userId: string,
    { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
  ): Promise<void> {
    await simulateNetworkDelay();
    const users = await readUsersDb();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      throw new AppError({ message: 'Usuario no encontrado', code: 'NOT_FOUND', status: 404 });
    }

    if (users[index]!.passwordHash !== mockHash(currentPassword)) {
      throw new AppError({ message: 'La contraseña actual es incorrecta', code: 'INVALID_CREDENTIALS' });
    }

    users[index] = {
      ...users[index]!,
      passwordHash: mockHash(newPassword),
      updatedAt: new Date().toISOString(),
    };
    await writeUsersDb(users);
  },
};
