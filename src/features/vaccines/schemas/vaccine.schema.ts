import { z } from 'zod';

export const vaccineFormSchema = z.object({
  name: z.string().min(1, 'Ingresa el nombre de la vacuna').max(80),
  applicationDate: z
    .string()
    .min(1, 'Ingresa la fecha de aplicación')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD'),
  nextDoseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
    .optional()
    .or(z.literal('')),
  veterinarian: z.string().max(80).optional().or(z.literal('')),
  clinic: z.string().max(80).optional().or(z.literal('')),
  batchNumber: z.string().max(40).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type VaccineFormValues = z.infer<typeof vaccineFormSchema>;
