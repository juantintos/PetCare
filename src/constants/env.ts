/**
 * Qué es: punto único de acceso a variables de entorno.
 * Por qué lo usamos: Expo expone `process.env.EXPO_PUBLIC_*` en tiempo de
 * build, pero acceder a `process.env` directamente desde cualquier archivo
 * hace imposible saber qué variables usa la app y no da errores claros si
 * falta alguna.
 * Qué problema resuelve: falla rápido (fail fast) en desarrollo si falta una
 * variable requerida, en vez de fallar silenciosamente en producción.
 */

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(
      `[env] Falta la variable de entorno "${key}". Revisa tu archivo .env (ver .env.example).`,
    );
  }

  return value;
};

export const env = {
  apiUrl: getEnvVar('EXPO_PUBLIC_API_URL', 'https://mock.petcare.local/api'),
  useMockApi: getEnvVar('EXPO_PUBLIC_USE_MOCK_API', 'true') === 'true',
} as const;
