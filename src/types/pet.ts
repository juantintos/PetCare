export type PetSpecies = 'dog' | 'cat' | 'other';

export type PetGender = 'male' | 'female' | 'unknown';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  gender: PetGender;
  birthDate: string; // ISO date string (YYYY-MM-DD)
  weight: number | null; // kg
  photoUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload de creación: se omiten los campos que genera el servidor
 * (id, timestamps) para que el formulario no pueda enviarlos por error.
 */
export type CreatePetInput = Omit<Pet, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;

export type UpdatePetInput = Partial<CreatePetInput>;
