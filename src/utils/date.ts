import { VACCINE_UPCOMING_THRESHOLD_DAYS } from '@/constants/app';
import type { VaccineStatus } from '@/types';

/**
 * Qué es: único punto de la app donde se manipulan fechas.
 * Por qué lo usamos: `new Date(...)` repetido en cada pantalla hace que
 * cambiar el formato regional, el timezone, o el criterio de "vacuna
 * próxima" implique tocar N archivos. Aquí es un cambio de una función.
 * Qué problema resuelve: consistencia de formato en toda la app y una única
 * fuente de verdad para "¿qué significa que una vacuna esté vencida?".
 *
 * Nota sobre timezone: todas las fechas de dominio (birthDate,
 * applicationDate, nextDoseDate) se guardan como string ISO "YYYY-MM-DD"
 * (sin hora). Se parsean como fecha LOCAL (no UTC) para evitar el bug clásico
 * de "la fecha se corre un día" cuando el usuario está en un timezone
 * negativo respecto a UTC.
 */

const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const;

/** Parsea "YYYY-MM-DD" como fecha local, evitando el corrimiento de UTC. */
export function parseISODate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Formatea "2026-09-15" como "15 de septiembre de 2026". */
export function formatDate(isoDate: string): string {
  const date = parseISODate(isoDate);
  return `${date.getDate()} de ${MONTHS_ES[date.getMonth()]} de ${date.getFullYear()}`;
}

/** Formatea "2026-09-15" como "15 Sep 2026" (para espacios compactos como cards). */
export function formatDateShort(isoDate: string): string {
  const date = parseISODate(isoDate);
  const month = MONTHS_ES[date.getMonth()]!.slice(0, 3);
  return `${date.getDate()} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

/** Calcula la edad a partir de birthDate, con meses para mascotas menores a 1 año. */
export function calculateAge(birthDateISO: string): string {
  const birthDate = parseISODate(birthDateISO);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) {
    return months <= 1 ? `${Math.max(months, 0)} mes` : `${months} meses`;
  }
  if (months === 0) {
    return years === 1 ? '1 año' : `${years} años`;
  }
  return `${years} ${years === 1 ? 'año' : 'años'}, ${months} ${months === 1 ? 'mes' : 'meses'}`;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startOfA = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const startOfB = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((startOfB.getTime() - startOfA.getTime()) / msPerDay);
}

export function isVaccineExpired(nextDoseDateISO: string | null): boolean {
  if (!nextDoseDateISO) return false;
  return daysBetween(new Date(), parseISODate(nextDoseDateISO)) < 0;
}

export function isVaccineUpcoming(nextDoseDateISO: string | null): boolean {
  if (!nextDoseDateISO) return false;
  const days = daysBetween(new Date(), parseISODate(nextDoseDateISO));
  return days >= 0 && days <= VACCINE_UPCOMING_THRESHOLD_DAYS;
}

/**
 * Qué es: función única que decide el estado de una vacuna.
 * Por qué lo usamos: el brief define 3 estados (Aplicada/Próxima/Vencida) que
 * se muestran en varias pantallas (dashboard, detalle de mascota, cards) —
 * deben calcularse siempre igual, en un solo lugar.
 */
export function getVaccineStatus(nextDoseDateISO: string | null): VaccineStatus {
  if (isVaccineExpired(nextDoseDateISO)) return 'expired';
  if (isVaccineUpcoming(nextDoseDateISO)) return 'upcoming';
  return 'applied';
}

export function daysUntil(nextDoseDateISO: string): number {
  return daysBetween(new Date(), parseISODate(nextDoseDateISO));
}
