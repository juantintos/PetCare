export type VaccineStatus = 'applied' | 'upcoming' | 'expired';

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  applicationDate: string; // ISO date string
  nextDoseDate: string | null;
  veterinarian: string | null;
  clinic: string | null;
  batchNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateVaccineInput = Omit<Vaccine, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateVaccineInput = Partial<Omit<CreateVaccineInput, 'petId'>>;
