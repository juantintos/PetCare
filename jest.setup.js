// Mock oficial de AsyncStorage para entorno de tests (sin dispositivo real).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// SecureStore no tiene mock oficial; lo simulamos con un Map en memoria para
// que utils/secureStorage.ts y stores/auth.store.ts funcionen en tests.
//
// El Map se crea DENTRO del factory de jest.mock(), no fuera. Jest hoistea
// las llamadas a jest.mock() al principio del archivo, antes de que
// cualquier const de nivel de módulo se haya evaluado — por eso el factory
// no puede cerrar sobre una variable externa. Declararla adentro evita el
// problema por completo.
jest.mock('expo-secure-store', () => {
  const store = new Map();

  return {
    getItemAsync: jest.fn((key) => Promise.resolve(store.get(key) ?? null)),
    setItemAsync: jest.fn((key, value) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((key) => {
      store.delete(key);
      return Promise.resolve();
    }),
  };
});