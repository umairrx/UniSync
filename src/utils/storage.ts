export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }

    const parsed = JSON.parse(stored) as T;
    return parsed;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`ERROR: Failed to load ${key} from storage: ${errorMessage}`);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "QuotaExceededError") {
        console.error(`ERROR: Storage quota exceeded for ${key}`);
      } else if (error.message.includes("private")) {
        console.error(`ERROR: Private browsing mode - storage unavailable for ${key}`);
      } else {
        console.error(`ERROR: Failed to save ${key} to storage: ${error.message}`);
      }
    }
    return false;
  }
}
