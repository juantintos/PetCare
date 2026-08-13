import { useMutation } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/stores/auth.store';
import { toAppError } from '@/utils/errors';

export function useChangePassword() {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (input: { currentPassword: string; newPassword: string }) => {
      try {
        await profileService.changePassword(user!.id, input);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}
