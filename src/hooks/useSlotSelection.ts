import { useState, useCallback } from "react";
import type { Course, DayOfWeek, TimeSlot } from "@/types";

export function useSlotSelection() {
  const [selectedSlot, setSelectedSlot] = useState<{
    day: DayOfWeek;
    time: TimeSlot;
  } | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleSlotDoubleClick = useCallback((day: DayOfWeek, time: TimeSlot) => {
    setSelectedSlot({ day, time });
  }, []);

  return {
    selectedSlot,
    setSelectedSlot,
    courseToDelete,
    setCourseToDelete,
    handleSlotDoubleClick,
  };
}
