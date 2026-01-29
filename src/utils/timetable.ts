import type { DayOfWeek, TimeSlot, TimetableSettings } from "@/types";

export function createSlotKey(day: DayOfWeek, time: TimeSlot): string {
  return `${day}-${time}`;
}

export function parseSlotKey(slotKey: string): { day: DayOfWeek; time: TimeSlot } | null {
  const parts = slotKey.split("-");

  const day = parts[0] as DayOfWeek;
  const time = parts.slice(1).join("-");

  if (day && time) {
    return { day, time };
  }
  return null;
}

export function formatTime(time: TimeSlot, intervalMinutes: number = 60): string {
  const [h, m] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(h, m, 0, 0);

  const end = new Date(start.getTime() + intervalMinutes * 60000);

  const format = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minStr} ${ampm}`;
  };

  return `${format(start)} - ${format(end)}`;
}

export function formatTimeSlotShort(time: TimeSlot, intervalMinutes: number = 60): string {
  const [h, m] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(h, m, 0, 0);

  const end = new Date(start.getTime() + intervalMinutes * 60000);

  const formatHour = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const displayHours = hours % 12 || 12;
    const minStr = minutes < 10 ? "0" + minutes : minutes;
    return {
      full: `${displayHours}:${minStr}`,
      ampm: hours >= 12 ? "PM" : "AM",
    };
  };

  const s = formatHour(start);
  const e = formatHour(end);

  if (s.ampm === e.ampm) {
    return `${s.full} - ${e.full} ${s.ampm}`;
  }
  return `${s.full} ${s.ampm} - ${e.full} ${e.ampm}`;
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
