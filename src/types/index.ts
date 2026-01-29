export interface Course {
  id: string;

  code: string;

  name: string;

  class: string;

  credits: number;

  faculty?: string;

  classroom?: string;
}

export interface TimetableEntry {
  courseId: string;

  classroom?: string;
}

export type TimetableData = Record<string, TimetableEntry[]>;

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type TimeSlot = string;

export interface TimetableSettings {
  startTime: string;

  endTime: string;

  intervalMinutes: number;
}

export const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const DEFAULT_SETTINGS: TimetableSettings = {
  startTime: "08:00",
  endTime: "17:00",
  intervalMinutes: 60,
};

export interface TimetableImage {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: number;
}

export const STORAGE_KEYS = {
  COURSES: "timetable_courses",
  TIMETABLE: "timetable_data",
  SETTINGS: "timetable_settings",
  TIMETABLE_IMAGES: "timetable_images",
} as const;
