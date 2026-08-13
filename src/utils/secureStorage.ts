import * as SecureStore from 'expo-secure-store';

/**
 * Qué es: wrapper sobre expo-secure-store con manejo de errores consistente.
 * Por qué lo usamos: SecureStore puede fallar (dispositivo sin keychain
 * configurado, etc.) y queremos que esos fallos nunca tumben la app — en el
 * peor caso, tratamos "no hay token" igual que "error leyendo el token".
 * Qué problema resuelve: es la ÚNICA parte del código que sabe que el token
 * vive en SecureStore. Si mañana cambiamos el mecanismo de almacenamiento,
 * solo se toca este archivo.
 */
export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`[secureStorage] Error leyendo "${key}"`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`[secureStorage] Error guardando "${key}"`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[secureStorage] Error eliminando "${key}"`, error);
    }
  },
};
