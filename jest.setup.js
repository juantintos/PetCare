// Mock oficial de AsyncStorage para entorno de tests (sin dispositivo real).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// SecureStore no tiene mock oficial; lo simulamos con un Map en memoria para
// que utils/secureStorage.ts y stores/auth.store.ts funcionen en tests.
const secureStoreMock = new Map();
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn((key) => Promise.resolve(secureStoreMock.get(key) ?? null)),
  setItemAsync: jest.fn((key, value) => {
    secureStoreMock.set(key, value);
    return Promise.resolve();
  }),
  deleteItemAsync: jest.fn((key) => {
    secureStoreMock.delete(key);
    return Promise.resolve();
  }),
}));
