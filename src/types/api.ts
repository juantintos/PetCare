/**
 * Envoltorio genérico de respuesta exitosa.
 * Por qué: da forma consistente a toda respuesta del backend (real o mock),
 * sin importar si se usa REST, Supabase o Firebase por debajo.
 */
export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
}

/**
 * Error de dominio normalizado. Todas las capas de servicio deben lanzar
 * este tipo (ver services/api.ts) para que la UI nunca tenga que saber si
 * el error vino de Axios, fetch, Supabase, etc.
 */
export interface ApiError {
  message: string;
  code: string;
  status?: number;
}
