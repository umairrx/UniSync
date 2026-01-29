export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const COURSE_VALS = {
  CODE_REGEX: /^[A-Z0-9\s\-_]{1,20}$/,
  SECTION_REGEX: /^[A-Z0-9-]{1,20}$/,
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  MIN_CREDITS: 0,
  MAX_CREDITS: 12,
} as const;

export function validateCourseCode(code: string): ValidationResult {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { isValid: false, error: "Course code is required" };
  if (!COURSE_VALS.CODE_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error:
        "Course code must be 1-20 alphanumeric characters (spaces, hyphens, and underscores allowed)",
    };
  }
  return { isValid: true };
}

export function validateCourseName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) return { isValid: false, error: "Course name is required" };
  if (
    trimmed.length < COURSE_VALS.NAME_MIN_LENGTH ||
    trimmed.length > COURSE_VALS.NAME_MAX_LENGTH
  ) {
    return {
      isValid: false,
      error: `Course name must be between ${COURSE_VALS.NAME_MIN_LENGTH} and ${COURSE_VALS.NAME_MAX_LENGTH} characters`,
    };
  }
  return { isValid: true };
}

export function validateSection(section: string): ValidationResult {
  const trimmed = section.trim().toUpperCase();
  if (!trimmed) return { isValid: false, error: "Section is required" };
  if (!COURSE_VALS.SECTION_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: "Section must be 1-20 alphanumeric characters (hyphens allowed)",
    };
  }
  return { isValid: true };
}

export function validateCredits(credits: number | string): ValidationResult {
  const value = typeof credits === "string" ? Number.parseInt(credits, 10) : credits;
  if (Number.isNaN(value) || value < COURSE_VALS.MIN_CREDITS || value > COURSE_VALS.MAX_CREDITS) {
    return {
      isValid: false,
      error: `Credits must be a number between ${COURSE_VALS.MIN_CREDITS} and ${COURSE_VALS.MAX_CREDITS}`,
    };
  }
  return { isValid: true };
}

export function validateTimeFormat(time: string): ValidationResult {
  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time.trim())) {
    return {
      isValid: false,
      error: `Invalid time format '${time}'. Use HH:MM (24-hour, e.g., "08:00", "14:30")`,
    };
  }
  return { isValid: true };
}

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export function validateDay(day: string): ValidationResult {
  if (!DAYS_OF_WEEK.includes(day as (typeof DAYS_OF_WEEK)[number])) {
    return {
      isValid: false,
      error: `Invalid day '${day}'. Must be one of: ${DAYS_OF_WEEK.join(", ")}`,
    };
  }
  return { isValid: true };
}
