import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { FormInput, PasswordInput } from '@/components/forms';
import { useToast } from '@/components/common/Toast';
import { useLogout, useSession } from '@/features/auth/hooks';
import { useUpdateProfile, useChangePassword } from '@/features/profile/hooks';
import {
  editProfileSchema,
  changePasswordSchema,
  type EditProfileFormValues,
  type ChangePasswordFormValues,
} from '@/features/profile/schemas/profile.schema';
import { usePets } from '@/features/pets/hooks';
import { spacing } from '@/theme';

export default function ProfileScreen() {
  const { user } = useSession();
  const logout = useLogout();
  const petsQuery = usePets();
  const { showToast } = useToast();

  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const editForm = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const handleLogoutPress = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => logout.mutate() },
    ]);
  };

  const handleOpenEdit = () => {
    editForm.reset({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' });
    setEditingProfile(true);
  };

  const handleSubmitEdit = (values: EditProfileFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => {
        showToast('Perfil actualizado correctamente');
        setEditingProfile(false);
      },
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  const handleOpenChangePassword = () => {
    passwordForm.reset({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setChangingPassword(true);
  };

  const handleSubmitPassword = (values: ChangePasswordFormValues) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        showToast('Contraseña actualizada correctamente');
        setChangingPassword(false);
      },
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  if (!user) return null;

  return (
    <ScreenContainer>
      <View style={{ gap: spacing.xl }}>
        <View style={{ alignItems: 'center', gap: spacing.md }}>
          <Avatar uri={user.avatarUrl} name={`${user.firstName} ${user.lastName}`} size={88} />
          <View style={{ alignItems: 'center' }}>
            <Text variant="h2">
              {user.firstName} {user.lastName}
            </Text>
            <Text variant="body" color="secondary">
              {user.email}
            </Text>
            <Text variant="caption" color="tertiary" style={{ marginTop: spacing.xs }}>
              {petsQuery.data?.length ?? 0} {petsQuery.data?.length === 1 ? 'mascota' : 'mascotas'}
            </Text>
          </View>
        </View>

        <Card style={{ gap: spacing.sm }}>
          <Button label="Editar información" variant="outline" onPress={handleOpenEdit} />
          <Button label="Cambiar contraseña" variant="outline" onPress={handleOpenChangePassword} />
        </Card>

        <Button
          label="Cerrar sesión"
          variant="danger"
          onPress={handleLogoutPress}
          loading={logout.isPending}
        />
      </View>

      <Modal visible={editingProfile} onClose={() => setEditingProfile(false)}>
        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Editar información</Text>
          <FormInput control={editForm.control} name="firstName" label="Nombre" />
          <FormInput control={editForm.control} name="lastName" label="Apellido" />
          <Button
            label="Guardar cambios"
            onPress={editForm.handleSubmit(handleSubmitEdit)}
            loading={updateProfile.isPending}
            fullWidth
          />
        </View>
      </Modal>

      <Modal visible={changingPassword} onClose={() => setChangingPassword(false)}>
        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Cambiar contraseña</Text>
          <PasswordInput
            control={passwordForm.control}
            name="currentPassword"
            label="Contraseña actual"
          />
          <PasswordInput
            control={passwordForm.control}
            name="newPassword"
            label="Nueva contraseña"
          />
          <PasswordInput
            control={passwordForm.control}
            name="confirmNewPassword"
            label="Confirmar nueva contraseña"
          />
          {changePassword.isError && (
            <Text variant="caption" style={{ color: '#E4572E' }}>
              {changePassword.error.message}
            </Text>
          )}
          <Button
            label="Actualizar contraseña"
            onPress={passwordForm.handleSubmit(handleSubmitPassword)}
            loading={changePassword.isPending}
            fullWidth
          />
        </View>
      </Modal>
    </ScreenContainer>
  );
}
