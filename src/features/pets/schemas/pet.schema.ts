import { z } from 'zod';

export const petSpeciesOptions = [
  { value: 'dog', label: 'Perro', icon: '🐶' },
  { value: 'cat', label: 'Gato', icon: '🐱' },
  { value: 'other', label: 'Otro', icon: '🐾' },
] as const;

export const petGenderOptions = [
  { value: 'male', label: 'Macho' },
  { value: 'female', label: 'Hembra' },
  { value: 'unknown', label: 'No especificado' },
] as const;

export const petFormSchema = z.object({
  name: z.string().min(1, 'Ingresa el nombre de tu mascota').max(50),
  species: z.enum(['dog', 'cat', 'other'], { required_error: 'Selecciona una especie' }),
  breed: z.string().max(50).optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'unknown']),
  birthDate: z
    .string()
    .min(1, 'Ingresa la fecha de nacimiento')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD'),
  weight: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), 'El peso debe ser un número')
    .or(z.literal('')),
  photoUrl: z.string().nullable().optional(),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type PetFormValues = z.infer<typeof petFormSchema>;
