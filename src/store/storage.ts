// Stockage clé-valeur sur le téléphone (SQLite, inclus dans Expo).
import Storage from 'expo-sqlite/kv-store';

export const kv = {
  getItem: (key: string) => Storage.getItem(key),
  setItem: (key: string, value: string) => Storage.setItem(key, value),
  removeItem: (key: string) => Storage.removeItem(key),
};
