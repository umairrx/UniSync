import type { Course, DayOfWeek, TimeSlot } from "@/types";
import { validateDay, validateTimeFormat } from "@/utils/validation";
import { createSlotKey } from "@/utils/timetable";

export interface TimetableImportResult {
  assignments: { slotKey: string; courseId: string; classroom?: string }[];
  missingCourses: { code: string; section?: string; name: string }[];
  errors: string[];
}

export function parseTimetableImport(jsonInput: string, courses: Course[]): TimetableImportResult {
  const assignments: { slotKey: string; courseId: string; classroom?: string }[] = [];
  const errors: string[] = [];
  const missingCourses: { code: string; section?: string; name: string }[] = [];
  const missingCourseKeys = new Set<string>();

  try {
    const parsed = JSON.parse(jsonInput);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON must be an array of assignment objects");
    }

    parsed.forEach(
      (
        item: {
          day?: string;
          time?: string;
          courseCode?: string;
          section?: string;
          classroom?: string;
          courseName?: string;
        },
        index,
      ) => {
        if (!item.day || !item.time || !item.courseCode) {
          errors.push(`Item ${index + 1}: Missing day, time, or courseCode`);
          return;
        }

        const day = String(item.day).trim();
        const dayVal = validateDay(day);
        if (!dayVal.isValid) {
          errors.push(`Item ${index + 1}: ${dayVal.error}`);
          return;
        }

        const timeStr = String(item.time).trim();
        const timeVal = validateTimeFormat(timeStr);
        if (!timeVal.isValid) {
          errors.push(`Item ${index + 1}: ${timeVal.error}`);
          return;
        }

        const time = timeStr as TimeSlot;

        let foundCourse: Course | undefined;
        const courseCode = String(item.courseCode).toUpperCase();
        const section = item.section ? String(item.section).toUpperCase() : undefined;

        if (section) {
          foundCourse = courses.find((c) => c.code === courseCode && c.class === section);
        } else {
          const matches = courses.filter((c) => c.code === courseCode);
          if (matches.length === 1) {
            foundCourse = matches[0];
          } else if (matches.length > 1) {
            errors.push(
              `Item ${index + 1}: Multiple courses found for code '${item.courseCode}'. Please specify 'section'.`,
            );
            return;
          }
        }

        if (!foundCourse) {
          const key = `${courseCode}-${section || "DEFAULT"}`;
          if (!missingCourseKeys.has(key)) {
            missingCourseKeys.add(key);
            missingCourses.push({
              code: courseCode,
              section: section,
              name: (item.courseName as string) || courseCode,
            });
          }

          assignments.push({
            slotKey: createSlotKey(day as DayOfWeek, time),
            courseId: `temp-${key}`,
            classroom: typeof item.classroom === "string" ? item.classroom : undefined,
          });
          return;
        }

        assignments.push({
          slotKey: createSlotKey(day as DayOfWeek, time),
          courseId: foundCourse.id,
          classroom: typeof item.classroom === "string" ? item.classroom : undefined,
        });
      },
    );
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "Invalid JSON format");
  }

  return { assignments, missingCourses, errors };
}
