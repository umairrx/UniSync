import { useState, useEffect, useRef } from "react";
import { loadFromStorage, saveToStorage } from "@/utils/storage";
import { toast } from "sonner";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => loadFromStorage<T>(key, initialValue));
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          setState(newState);
        } catch (err) {
          console.error("Failed to parse storage update", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const success = saveToStorage(key, state);
      if (!success) {
        toast.error(`Failed to save ${key}. Your storage might be full.`, {
          id: `storage-error-${key}`,
        });
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [key, state]);

  useEffect(() => {
    return () => {
      saveToStorage(key, stateRef.current);
    };
  }, [key]);

  return [state, setState];
}
