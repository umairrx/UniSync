import { useCallback } from "react";
import type { TimetableData } from "@/types";
import { STORAGE_KEYS } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { normalizeTimetableData } from "@/utils/timetableMigration";
import { loadFromStorage } from "@/utils/storage";

export function useTimetable() {
  const [timetable, setTimetable] = useLocalStorage<TimetableData>(
    STORAGE_KEYS.TIMETABLE,
    normalizeTimetableData(loadFromStorage<Record<string, unknown>>(STORAGE_KEYS.TIMETABLE, {})),
  );

  const assignCourse = useCallback(
    (slotKey: string, courseIdOrData: string | { courseId: string; classroom?: string }) => {
      setTimetable((prev) => {
        const entry =
          typeof courseIdOrData === "string" ? { courseId: courseIdOrData } : courseIdOrData;

        const existingEntries = prev[slotKey] || [];
        const index = existingEntries.findIndex((e) => e.courseId === entry.courseId);

        if (index !== -1) {
          const updatedEntries = [...existingEntries];
          updatedEntries[index] = { ...updatedEntries[index], classroom: entry.classroom };
          return { ...prev, [slotKey]: updatedEntries };
        }

        return { ...prev, [slotKey]: [...existingEntries, entry] };
      });
    },
    [setTimetable],
  );

  const removeCourseFromSlot = useCallback(
    (slotKey: string, courseId: string) => {
      setTimetable((prev) => {
        const entries = prev[slotKey] || [];

        const filtered = entries.filter((e) => e.courseId !== courseId);

        if (filtered.length === 0) {
          const updated = { ...prev };
          delete updated[slotKey];
          return updated;
        }

        return { ...prev, [slotKey]: filtered };
      });
    },
    [setTimetable],
  );

  const removeCourseFromAllSlots = useCallback(
    (courseId: string) => {
      setTimetable((prev) => {
        const updated: TimetableData = {};
        Object.keys(prev).forEach((key) => {
          const filtered = prev[key].filter((e) => e.courseId !== courseId);
          if (filtered.length > 0) {
            updated[key] = filtered;
          }
        });
        return updated;
      });
    },
    [setTimetable],
  );

  const clearTimetable = useCallback(() => {
    setTimetable({});
  }, [setTimetable]);

  const getSlotCourseIds = (slotKey: string) => {
    return (timetable[slotKey] || []).map((e) => e.courseId);
  };

  const getSlotEntries = useCallback(
    (slotKey: string) => {
      return timetable[slotKey] || [];
    },
    [timetable],
  );

  return {
    timetable,
    setTimetable,
    assignCourse,
    removeCourseFromSlot,
    removeCourseFromAllSlots,
    clearTimetable,
    getSlotCourseIds,
    getSlotEntries,
  };
}
