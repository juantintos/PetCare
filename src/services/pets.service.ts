import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CreatePetInput, Pet, UpdatePetInput } from '@/types';
import { AppError } from '@/utils/errors';
import { simulateNetworkDelay } from './api';

/**
 * Qué es: servicio mock de mascotas, mismo contrato que tendría contra un
 * backend real (ver nota extensa en auth.service.ts).
 * Por qué se filtra siempre por ownerId: en un backend real esto lo haría
 * la política de autorización del servidor (Row Level Security en Supabase,
 * por ejemplo); lo replicamos aquí para que el comportamiento observable de
 * la app sea el mismo desde el día uno.
 */

const PETS_DB_KEY = 'petcare_mock_pets_db';

async function readPetsDb(): Promise<Pet[]> {
  const raw = await AsyncStorage.getItem(PETS_DB_KEY);
  return raw ? (JSON.parse(raw) as Pet[]) : [];
}

async function writePetsDb(pets: Pet[]): Promise<void> {
  await AsyncStorage.setItem(PETS_DB_KEY, JSON.stringify(pets));
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const petsService = {
  async list(ownerId: string): Promise<Pet[]> {
    await simulateNetworkDelay();
    const pets = await readPetsDb();
    return pets
      .filter((pet) => pet.ownerId === ownerId)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getById(id: string): Promise<Pet> {
    await simulateNetworkDelay(300);
    const pets = await readPetsDb();
    const pet = pets.find((p) => p.id === id);

    if (!pet) {
      throw new AppError({ message: 'Mascota no encontrada', code: 'NOT_FOUND', status: 404 });
    }

    return pet;
  },

  async create(ownerId: string, input: CreatePetInput): Promise<Pet> {
    await simulateNetworkDelay();
    const pets = await readPetsDb();
    const now = new Date().toISOString();

    const newPet: Pet = {
      ...input,
      id: generateId('pet'),
      ownerId,
      createdAt: now,
      updatedAt: now,
    };

    await writePetsDb([...pets, newPet]);
    return newPet;
  },

  async update(id: string, input: UpdatePetInput): Promise<Pet> {
    await simulateNetworkDelay();
    const pets = await readPetsDb();
    const index = pets.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new AppError({ message: 'Mascota no encontrada', code: 'NOT_FOUND', status: 404 });
    }

    const existing = pets[index]!;
    const updated: Pet = { ...existing, ...input, updatedAt: new Date().toISOString() };
    pets[index] = updated;

    await writePetsDb(pets);
    return updated;
  },

  async remove(id: string): Promise<void> {
    await simulateNetworkDelay();
    const pets = await readPetsDb();
    await writePetsDb(pets.filter((p) => p.id !== id));
    // Nota: en la Fase 4 borramos también las vacunas asociadas a esta
    // mascota (ver vaccines.service.ts → removeByPetId), para no dejar
    // datos huérfanos.
  },
};
