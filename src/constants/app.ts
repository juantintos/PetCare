/**
 * Qué es: valores constantes usados en más de un lugar (evita "magic strings").
 * Por qué: si "petcare_auth_token" estuviera escrito a mano en 5 archivos y en
 * uno se escribe mal, tenemos un bug silencioso muy difícil de rastrear.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'petcare_auth_token',
  AUTH_USER: 'petcare_auth_user',
} as const;

export const QUERY_KEYS = {
  PETS: 'pets',
  PET: 'pet',
  VACCINES: 'vaccines',
  VACCINE: 'vaccine',
  PROFILE: 'profile',
} as const;

export const VACCINE_UPCOMING_THRESHOLD_DAYS = 7;

export const APP_NAME = 'PetCare';
