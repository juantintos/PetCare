import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CreateVaccineInput, UpdateVaccineInput, Vaccine } from '@/types';
import { AppError } from '@/utils/errors';
import { simulateNetworkDelay } from './api';

const VACCINES_DB_KEY = 'petcare_mock_vaccines_db';

async function readVaccinesDb(): Promise<Vaccine[]> {
  const raw = await AsyncStorage.getItem(VACCINES_DB_KEY);
  return raw ? (JSON.parse(raw) as Vaccine[]) : [];
}

async function writeVaccinesDb(vaccines: Vaccine[]): Promise<void> {
  await AsyncStorage.setItem(VACCINES_DB_KEY, JSON.stringify(vaccines));
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const vaccinesService = {
  async listByPet(petId: string): Promise<Vaccine[]> {
    await simulateNetworkDelay();
    const vaccines = await readVaccinesDb();
    return vaccines
      .filter((v) => v.petId === petId)
      .sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));
  },

  /**
   * Trae TODAS las vacunas de todas las mascotas del usuario. La usa el
   * dashboard para calcular "próximas" y "vencidas" sin tener que hacer N
   * llamadas (una por mascota).
   */
  async listByPetIds(petIds: string[]): Promise<Vaccine[]> {
    await simulateNetworkDelay();
    const vaccines = await readVaccinesDb();
    const idSet = new Set(petIds);
    return vaccines.filter((v) => idSet.has(v.petId));
  },

  async getById(id: string): Promise<Vaccine> {
    await simulateNetworkDelay(300);
    const vaccines = await readVaccinesDb();
    const vaccine = vaccines.find((v) => v.id === id);

    if (!vaccine) {
      throw new AppError({ message: 'Vacuna no encontrada', code: 'NOT_FOUND', status: 404 });
    }

    return vaccine;
  },

  async create(input: CreateVaccineInput): Promise<Vaccine> {
    await simulateNetworkDelay();
    const vaccines = await readVaccinesDb();
    const now = new Date().toISOString();

    const newVaccine: Vaccine = { ...input, id: generateId('vac'), createdAt: now, updatedAt: now };

    await writeVaccinesDb([...vaccines, newVaccine]);
    return newVaccine;
  },

  async update(id: string, input: UpdateVaccineInput): Promise<Vaccine> {
    await simulateNetworkDelay();
    const vaccines = await readVaccinesDb();
    const index = vaccines.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new AppError({ message: 'Vacuna no encontrada', code: 'NOT_FOUND', status: 404 });
    }

    const updated: Vaccine = { ...vaccines[index]!, ...input, updatedAt: new Date().toISOString() };
    vaccines[index] = updated;

    await writeVaccinesDb(vaccines);
    return updated;
  },

  async remove(id: string): Promise<void> {
    await simulateNetworkDelay();
    const vaccines = await readVaccinesDb();
    await writeVaccinesDb(vaccines.filter((v) => v.id !== id));
  },

  async removeByPetId(petId: string): Promise<void> {
    const vaccines = await readVaccinesDb();
    await writeVaccinesDb(vaccines.filter((v) => v.petId !== petId));
  },
};
