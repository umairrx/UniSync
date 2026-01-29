import { useState } from "react";
import {
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Course } from "@/types";
import { toast } from "sonner";

export function useTimetableDragDrop(
  getCourseById: (id: string) => Course | undefined,
  assignCourse: (
    slotKey: string,
    courseIdOrData: string | { courseId: string; classroom?: string },
  ) => void,
  removeCourseFromSlot?: (slotKey: string, courseId: string) => void,
) {
  const [activeDragCourse, setActiveDragCourse] = useState<Course | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.course) {
      setActiveDragCourse(event.active.data.current.course);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragCourse(null);
    const { active, over } = event;

    if (over && active.data.current?.type === "course") {
      const course = active.data.current.course as Course;
      const sourceSlotKey = active.data.current.sourceSlotKey as string | undefined;

      if (!getCourseById(course.id)) {
        toast.warning(`Course ${course.code} is no longer available.`);
        return;
      }

      const targetSlotKey = over.id as string;

      if (sourceSlotKey === targetSlotKey) return;

      const classroom = active.data.current.classroom as string | undefined;

      assignCourse(targetSlotKey, { courseId: course.id, classroom });

      if (sourceSlotKey && removeCourseFromSlot) {
        removeCourseFromSlot(sourceSlotKey, course.id);
        toast.success(`Moved ${course.code} to new slot.`);
      }
    }
  };

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
    activeDragCourse,
  };
}
