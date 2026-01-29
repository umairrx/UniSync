import type { TimetableData, TimetableEntry } from "@/types";

export function normalizeTimetableData(data: Record<string, unknown>): TimetableData {
  const normalized: TimetableData = {};

  Object.keys(data).forEach((key) => {
    const val = data[key];

    if (Array.isArray(val)) {
      normalized[key] = val.filter(isValidTimetableEntry) as TimetableEntry[];
    } else if (typeof val === "string") {
      normalized[key] = [{ courseId: val }];
    } else if (isValidTimetableEntry(val)) {
      normalized[key] = [val as TimetableEntry];
    }
  });

  return normalized;
}

function isValidTimetableEntry(val: unknown): val is TimetableEntry {
  return (
    val !== null &&
    typeof val === "object" &&
    "courseId" in (val as object) &&
    typeof (val as { courseId: unknown }).courseId === "string"
  );
}
