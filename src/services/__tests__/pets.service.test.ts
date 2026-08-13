import AsyncStorage from '@react-native-async-storage/async-storage';
import { petsService } from '@/services/pets.service';
import type { CreatePetInput } from '@/types';

const basePetInput: CreatePetInput = {
  name: 'Luna',
  species: 'cat',
  breed: 'Siamés',
  gender: 'female',
  birthDate: '2022-03-01',
  weight: 4.2,
  photoUrl: null,
  notes: null,
};

const OWNER_ID = 'usr_test_1';

beforeEach(async () => {
  // Limpiamos el "mock DB" antes de cada test para que no se contaminen
  // entre sí (cada test parte de cero mascotas).
  await AsyncStorage.clear();
});

describe('petsService', () => {
  it('crea una mascota y la asocia al dueño correcto', async () => {
    const pet = await petsService.create(OWNER_ID, basePetInput);

    expect(pet.id).toBeTruthy();
    expect(pet.ownerId).toBe(OWNER_ID);
    expect(pet.name).toBe('Luna');
  });

  it('lista solo las mascotas del dueño solicitado', async () => {
    await petsService.create(OWNER_ID, basePetInput);
    await petsService.create('otro_usuario', { ...basePetInput, name: 'Rocky' });

    const pets = await petsService.list(OWNER_ID);

    expect(pets).toHaveLength(1);
    expect(pets[0]?.name).toBe('Luna');
  });

  it('actualiza los campos de una mascota existente', async () => {
    const pet = await petsService.create(OWNER_ID, basePetInput);

    const updated = await petsService.update(pet.id, { name: 'Luna Actualizada', weight: 4.8 });

    expect(updated.name).toBe('Luna Actualizada');
    expect(updated.weight).toBe(4.8);
    expect(updated.species).toBe('cat'); // los campos no enviados no cambian
  });

  it('lanza un error al actualizar una mascota inexistente', async () => {
    await expect(petsService.update('id_inexistente', { name: 'X' })).rejects.toThrow();
  });

  it('elimina una mascota', async () => {
    const pet = await petsService.create(OWNER_ID, basePetInput);

    await petsService.remove(pet.id);
    const pets = await petsService.list(OWNER_ID);

    expect(pets).toHaveLength(0);
  });
});
