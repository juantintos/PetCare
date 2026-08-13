import { petFormSchema } from '@/features/pets/schemas/pet.schema';

describe('petFormSchema', () => {
  const validPet = {
    name: 'Max',
    species: 'dog' as const,
    breed: 'Golden Retriever',
    gender: 'male' as const,
    birthDate: '2023-05-10',
    weight: '28.5',
    notes: '',
  };

  it('acepta una mascota válida', () => {
    expect(petFormSchema.safeParse(validPet).success).toBe(true);
  });

  it('rechaza un nombre vacío', () => {
    const result = petFormSchema.safeParse({ ...validPet, name: '' });
    expect(result.success).toBe(false);
  });

  it('rechaza una fecha de nacimiento con formato inválido', () => {
    const result = petFormSchema.safeParse({ ...validPet, birthDate: '10/05/2023' });
    expect(result.success).toBe(false);
  });

  it('rechaza un peso no numérico', () => {
    const result = petFormSchema.safeParse({ ...validPet, weight: 'mucho' });
    expect(result.success).toBe(false);
  });

  it('acepta peso vacío (es opcional)', () => {
    const result = petFormSchema.safeParse({ ...validPet, weight: '' });
    expect(result.success).toBe(true);
  });

  it('rechaza una especie fuera del enum', () => {
    const result = petFormSchema.safeParse({ ...validPet, species: 'dragon' });
    expect(result.success).toBe(false);
  });
});
