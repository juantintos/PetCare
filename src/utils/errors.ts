import type { ApiError } from '@/types';

/**
 * Qué es: clase de error de dominio que TODA la capa de servicios debe lanzar.
 * Por qué lo usamos: así la UI nunca necesita saber si el error vino de
 * fetch, Axios, Supabase o el mock — siempre recibe la misma forma.
 * Qué problema resuelve: desacopla completamente la UI de la implementación
 * del backend (ver punto 15 del brief).
 */
export class AppError extends Error implements ApiError {
  code: string;
  status?: number;

  constructor({ message, code, status }: ApiError) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Mensajes amigables por código de error. Los códigos técnicos (network,
 * timeout, etc.) jamás deben llegar a la pantalla — solo estos textos.
 */
const FRIENDLY_MESSAGES: Record<string, string> & { UNKNOWN: string } = {
  NETWORK_ERROR:
    'No pudimos conectarnos con el servidor.\nVerifica tu conexión e inténtalo nuevamente.',
  INVALID_CREDENTIALS: 'El correo o la contraseña son incorrectos.',
  EMAIL_ALREADY_EXISTS: 'Ya existe una cuenta registrada con este correo.',
  UNKNOWN: 'Ocurrió un error inesperado. Inténtalo de nuevo en unos minutos.',
};

/**
 * Qué es: función única que traduce cualquier error (conocido o no) a un
 * AppError con mensaje amigable.
 * Por qué lo usamos: centraliza el punto 19 del brief ("los errores técnicos
 * no deben mostrarse directamente al usuario") en un solo lugar, en vez de
 * hacer try/catch con mensajes hardcodeados en cada pantalla.
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // No exponemos error.message crudo (podría filtrar detalles técnicos
    // o internos del servidor) — solo lo dejamos en consola para depurar.
    console.error('[toAppError] Error no controlado:', error.message);
  }

  return new AppError({ message: FRIENDLY_MESSAGES.UNKNOWN, code: 'UNKNOWN' });
}

export function getFriendlyMessage(code: string): string {
  return FRIENDLY_MESSAGES[code] ?? FRIENDLY_MESSAGES.UNKNOWN;
}
