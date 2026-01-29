import type { TimetableSettings } from "@/types";
import { STORAGE_KEYS, DEFAULT_SETTINGS } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<TimetableSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS,
  );

  return {
    settings,
    setSettings,
  };
}
