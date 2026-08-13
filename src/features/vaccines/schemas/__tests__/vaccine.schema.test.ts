import { vaccineFormSchema } from '@/features/vaccines/schemas/vaccine.schema';

describe('vaccineFormSchema', () => {
  const validVaccine = {
    name: 'Rabia',
    applicationDate: '2026-01-15',
    nextDoseDate: '2027-01-15',
    veterinarian: 'Dra. López',
    clinic: 'Clínica San Roque',
    batchNumber: 'LT-001',
    notes: '',
  };

  it('acepta una vacuna válida', () => {
    expect(vaccineFormSchema.safeParse(validVaccine).success).toBe(true);
  });

  it('acepta que nextDoseDate esté vacío (dosis única)', () => {
    const result = vaccineFormSchema.safeParse({ ...validVaccine, nextDoseDate: '' });
    expect(result.success).toBe(true);
  });

  it('rechaza un nombre vacío', () => {
    const result = vaccineFormSchema.safeParse({ ...validVaccine, name: '' });
    expect(result.success).toBe(false);
  });

  it('rechaza una fecha de aplicación con formato inválido', () => {
    const result = vaccineFormSchema.safeParse({ ...validVaccine, applicationDate: '15-01-2026' });
    expect(result.success).toBe(false);
  });
});
