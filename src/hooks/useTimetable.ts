import { useState, useEffect, useCallback } from "react";
import type { Course, TimetableData, TimetableSettings } from "@/types";
import { STORAGE_KEYS, DEFAULT_SETTINGS } from "@/types";

function generateId(): string {
  return "_" + Math.random().toString(36).substring(2, 11);
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
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

function saveToStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`ERROR: Failed to save ${key} to storage: ${error}`);
  }
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(() =>
    loadFromStorage<Course[]>(STORAGE_KEYS.COURSES, []),
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COURSES, courses);
  }, [courses]);

  const addCourse = useCallback(
    (courseData: Omit<Course, "id">) => {
      const isDuplicate = courses.some(
        (course) =>
          course.code.toLowerCase() === courseData.code.toLowerCase() &&
          course.class.toLowerCase() === courseData.class.toLowerCase(),
      );

      if (isDuplicate) {
        throw new Error(`Course ${courseData.code} - Section ${courseData.class} already exists`);
      }

      const newCourse: Course = {
        ...courseData,
        id: generateId(),
      };
      setCourses((prev) => [...prev, newCourse]);
      return newCourse;
    },
    [courses],
  );

  const deleteCourse = useCallback((courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  }, []);

  const getCourseById = useCallback(
    (courseId: string) => {
      return courses.find((c) => c.id === courseId);
    },
    [courses],
  );

  const clearCourses = useCallback(() => {
    setCourses([]);
  }, []);

  return {
    courses,
    addCourse,
    deleteCourse,
    clearCourses,
    getCourseById,
  };
}

export function useTimetable() {
  const [timetable, setTimetable] = useState<TimetableData>(() => {
    const data = loadFromStorage<any>(STORAGE_KEYS.TIMETABLE, {});
    // Migration/Normalization: Convert string values to objects if needed on load
    const normalized: TimetableData = {};
    Object.keys(data).forEach(key => {
        const val = data[key];
        if (typeof val === 'string') {
            normalized[key] = { courseId: val };
        } else {
            normalized[key] = val;
        }
    });
    return normalized;
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TIMETABLE, timetable);
  }, [timetable]);

  const assignCourse = useCallback(
    (slotKey: string, courseIdOrData: string | { courseId: string; classroom?: string }) => {
      setTimetable((prev) => {
        const entry = typeof courseIdOrData === 'string' 
            ? { courseId: courseIdOrData } 
            : courseIdOrData;
        return { ...prev, [slotKey]: entry };
      });
    },
    [timetable],
  );

  const removeCourseFromSlot = useCallback((slotKey: string) => {
    setTimetable((prev) => {
      const updated = { ...prev };
      delete updated[slotKey];
      return updated;
    });
  }, []);

  const removeCourseFromAllSlots = useCallback((courseId: string) => {
    setTimetable((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key]?.courseId === courseId) {
          delete updated[key];
        }
      });
      return updated;
    });
  }, []);

  const clearTimetable = useCallback(() => {
    setTimetable({});
  }, []);

  const getSlotCourseId = useCallback(
    (slotKey: string) => {
      return timetable[slotKey]?.courseId;
    },
    [timetable],
  );
  
  const getSlotEntry = useCallback(
    (slotKey: string) => {
        return timetable[slotKey];
    },
    [timetable]
  );

  return {
    timetable,
    assignCourse,
    removeCourseFromSlot,
    removeCourseFromAllSlots,
    clearTimetable,
    getSlotCourseId,
    getSlotEntry
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<TimetableSettings>(() =>
    loadFromStorage<TimetableSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  return {
    settings,
    setSettings,
  };
}

export function useCredits(courses: Course[], timetable: TimetableData) {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const scheduledCourseIds = new Set(Object.values(timetable).map(entry => entry.courseId));
  const scheduledCredits = courses
    .filter((course) => scheduledCourseIds.has(course.id))
    .reduce((sum, course) => sum + course.credits, 0);

  return {
    totalCredits,
    scheduledCredits,
  };
}
