import { useMutation } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/stores/auth.store';
import { toAppError } from '@/utils/errors';
import type { User } from '@/types';

export function useUpdateProfile() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (changes: Pick<User, 'firstName' | 'lastName'>) => {
      try {
        return await profileService.updateProfile(user!.id, changes);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: async (updatedUser) => {
      await updateUser(updatedUser);
    },
  });
}
