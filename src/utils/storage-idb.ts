import { get, set, del, clear } from "idb-keyval";

export async function loadFromIDB<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const stored = await get(key);
    return stored === undefined ? defaultValue : (stored as T);
  } catch (error) {
    console.error(`Error loading ${key} from IndexedDB:`, error);
    return defaultValue;
  }
}

export async function saveToIDB<T>(key: string, data: T): Promise<boolean> {
  try {
    await set(key, data);
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to IndexedDB:`, error);
    return false;
  }
}

export async function removeFromIDB(key: string): Promise<boolean> {
  try {
    await del(key);
    return true;
  } catch (error) {
    console.error(`Error deleting ${key} from IndexedDB:`, error);
    return false;
  }
}

export async function clearIDB(): Promise<boolean> {
  try {
    await clear();
    return true;
  } catch (error) {
    console.error("Error clearing IndexedDB:", error);
    return false;
  }
}
