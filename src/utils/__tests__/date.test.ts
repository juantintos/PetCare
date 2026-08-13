import {
  calculateAge,
  formatDate,
  getVaccineStatus,
  isVaccineExpired,
  isVaccineUpcoming,
  toISODate,
} from '@/utils/date';

// Fijamos una fecha de referencia para que los tests sean deterministas,
// sin importar el día en que realmente se ejecuten.
const TODAY = new Date(2026, 7, 11); // 11 de agosto de 2026

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('formatDate', () => {
  it('formatea una fecha ISO en español', () => {
    expect(formatDate('2026-09-15')).toBe('15 de septiembre de 2026');
  });
});

describe('calculateAge', () => {
  it('calcula años completos', () => {
    expect(calculateAge('2023-08-11')).toBe('3 años');
  });

  it('calcula meses cuando es menor a un año', () => {
    expect(calculateAge('2026-06-11')).toBe('2 meses');
  });

  it('calcula años y meses combinados', () => {
    expect(calculateAge('2024-05-11')).toBe('2 años, 3 meses');
  });
});

describe('isVaccineExpired', () => {
  it('retorna true si la próxima dosis ya pasó', () => {
    expect(isVaccineExpired('2026-08-01')).toBe(true);
  });

  it('retorna false si la próxima dosis es hoy', () => {
    expect(isVaccineExpired(toISODate(TODAY))).toBe(false);
  });

  it('retorna false si no hay próxima dosis', () => {
    expect(isVaccineExpired(null)).toBe(false);
  });
});

describe('isVaccineUpcoming', () => {
  it('retorna true si faltan 7 días o menos', () => {
    expect(isVaccineUpcoming('2026-08-15')).toBe(true);
  });

  it('retorna false si faltan más de 7 días', () => {
    expect(isVaccineUpcoming('2026-09-01')).toBe(false);
  });

  it('retorna false si ya venció', () => {
    expect(isVaccineUpcoming('2026-08-01')).toBe(false);
  });
});

describe('getVaccineStatus', () => {
  it('retorna "expired" cuando la fecha ya pasó', () => {
    expect(getVaccineStatus('2026-08-01')).toBe('expired');
  });

  it('retorna "upcoming" cuando está dentro del umbral', () => {
    expect(getVaccineStatus('2026-08-16')).toBe('upcoming');
  });

  it('retorna "applied" cuando falta mucho o no hay próxima dosis', () => {
    expect(getVaccineStatus('2026-12-01')).toBe('applied');
    expect(getVaccineStatus(null)).toBe('applied');
  });
});
