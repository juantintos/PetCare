import { env } from '@/constants/env';

/**
 * Qué es: helpers compartidos por todos los archivos de `services/`.
 * Por qué lo usamos: aunque hoy solo tenemos el mock, dejamos ya el punto de
 * extensión para un cliente HTTP real (fetch/Axios) apuntando a `env.apiUrl`,
 * de forma que migrar de mock a REST sea cambiar esta función, no cada
 * pantalla (punto 15 del brief).
 */

/** Simula latencia de red realista para que el mock se sienta como un backend real. */
export function simulateNetworkDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Placeholder del cliente HTTP real. Cuando conectemos un backend, los
 * `*.service.ts` dejarán de usar el mock y llamarán a `apiFetch` en su lugar,
 * sin que la UI se entere del cambio.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
