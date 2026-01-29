import type { DayOfWeek, TimeSlot, TimetableSettings, TimetableData } from "@/types";
import { DAYS } from "@/types";

export function createSlotKey(day: DayOfWeek, time: TimeSlot): string {
  return `${day}-${time}`;
}

export function parseSlotKey(slotKey: string): { day: DayOfWeek; time: TimeSlot } | null {
  const parts = slotKey.split("-");

  const day = parts[0] as DayOfWeek;
  const time = parts.slice(1).join("-");

  if (day && time) {
    if (!DAYS.includes(day)) return null;

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) return null;

    return { day, time };
  }
  return null;
}

function getSlotTimeRange(time: TimeSlot, intervalMinutes: number) {
  const parts = time.split(":").map(Number);

  const h = parts[0] >= 0 && parts[0] < 24 ? parts[0] : 0;
  const m = parts[1] >= 0 && parts[1] < 60 ? parts[1] : 0;

  const start = new Date();
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + intervalMinutes * 60000);
  return { start, end };
}

function formatSingleTime(date: Date): { time: string; ampm: string } {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minStr = minutes < 10 ? "0" + minutes : minutes;
  return { time: `${hours}:${minStr}`, ampm };
}

export function formatTime(time: TimeSlot, intervalMinutes: number = 60): string {
  const { start, end } = getSlotTimeRange(time, intervalMinutes);
  const s = formatSingleTime(start);
  const e = formatSingleTime(end);
  return `${s.time} ${s.ampm} - ${e.time} ${e.ampm}`;
}

export function formatTimeSlotShort(time: TimeSlot, intervalMinutes: number = 60): string {
  const { start, end } = getSlotTimeRange(time, intervalMinutes);
  const s = formatSingleTime(start);
  const e = formatSingleTime(end);

  if (s.ampm === e.ampm) {
    return `${s.time} - ${e.time} ${s.ampm}`;
  }
  return `${s.time} ${s.ampm} - ${e.time} ${e.ampm}`;
}

export function formatTimeSlotStartOnly(time: TimeSlot): string {
  const parts = time.split(":").map(Number);
  const h = parts[0] >= 0 && parts[0] < 24 ? parts[0] : 0;
  const m = parts[1] >= 0 && parts[1] < 60 ? parts[1] : 0;
  
  const date = new Date();
  date.setHours(h, m, 0, 0);
  
  const { time: formattedTime, ampm } = formatSingleTime(date);
  return `${formattedTime} ${ampm}`;
}

export function generateTimeSlots(settings: TimetableSettings): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startH, startM] = settings.startTime.split(":").map(Number);
  const [endH, endM] = settings.endTime.split(":").map(Number);

  const current = new Date();
  current.setHours(startH, startM, 0, 0);

  const end = new Date();
  end.setHours(endH, endM, 0, 0);

  const interval = Math.max(1, settings.intervalMinutes);

  while (current < end) {
    const h = current.getHours().toString().padStart(2, "0");
    const m = current.getMinutes().toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
}

export function migrateTimetableOnSettingsChange(
  oldTimetable: TimetableData,
  oldSettings: TimetableSettings,
  newSettings: TimetableSettings,
): TimetableData {
  const oldSlots = generateTimeSlots(oldSettings);
  const newSlots = generateTimeSlots(newSettings);

  const timeMapping: Record<string, string> = {};

  oldSlots.forEach((oldTime) => {
    const [oldH, oldM] = oldTime.split(":").map(Number);
    const oldMinutes = oldH * 60 + oldM;

    let closestTime: string | null = null;
    let minDiff = Infinity;

    newSlots.forEach((newTime) => {
      const [newH, newM] = newTime.split(":").map(Number);
      const newMinutes = newH * 60 + newM;
      const diff = Math.abs(newMinutes - oldMinutes);

      if (diff < minDiff) {
        minDiff = diff;
        closestTime = newTime;
      }
    });

    if (closestTime && minDiff <= newSettings.intervalMinutes) {
      timeMapping[oldTime] = closestTime;
    }
  });

  const migratedTimetable: TimetableData = {};

  Object.entries(oldTimetable).forEach(([slotKey, entries]) => {
    const parsed = parseSlotKey(slotKey);
    if (parsed) {
      const { day, time } = parsed;
      const newTime = timeMapping[time];

      if (newTime) {
        const newSlotKey = createSlotKey(day, newTime);
        const existingEntries = migratedTimetable[newSlotKey] || [];

        const uniqueEntries = [...existingEntries];
        entries.forEach((entry) => {
          if (!uniqueEntries.some((e) => e.courseId === entry.courseId)) {
            uniqueEntries.push(entry);
          }
        });

        migratedTimetable[newSlotKey] = uniqueEntries;
      }
    }
  });

  return migratedTimetable;
}
