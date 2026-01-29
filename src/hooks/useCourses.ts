import { useCallback } from "react";
import type { Course } from "@/types";
import { STORAGE_KEYS } from "@/types";
import { generateId } from "@/utils/id";
import { useLocalStorage } from "./useLocalStorage";

export function useCourses() {
  const [courses, setCourses] = useLocalStorage<Course[]>(STORAGE_KEYS.COURSES, []);

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
    [courses, setCourses],
  );

  const deleteCourse = useCallback(
    (courseId: string) => {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    },
    [setCourses],
  );

  const getCourseById = useCallback(
    (courseId: string) => {
      return courses.find((c) => c.id === courseId);
    },
    [courses],
  );

  const clearCourses = useCallback(() => {
    setCourses([]);
  }, [setCourses]);

  return {
    courses,
    addCourse,
    deleteCourse,
    clearCourses,
    getCourseById,
  };
}
