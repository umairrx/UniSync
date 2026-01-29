import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Course, TimetableData } from "@/types";
import { parseSlotKey, formatTime } from "@/utils/timetable";

interface DeleteCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  timetable: TimetableData;
  onConfirmDelete: () => void;
}

export function DeleteCourseModal({
  open,
  onOpenChange,
  course,
  timetable,
  onConfirmDelete,
}: DeleteCourseModalProps) {
  if (!course) return null;

  const affectedSlots = Object.entries(timetable)
    .filter(([, entries]) => {
      return entries.some((e) => e.courseId === course.id);
    })
    .map(([slotKey]) => {
      const parsed = parseSlotKey(slotKey);
      return parsed ? `${parsed.day}, ${formatTime(parsed.time)}` : slotKey;
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Course
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this course? This will remove it from{" "}
            {affectedSlots.length} assigned time slot
            {affectedSlots.length !== 1 ? "s" : ""} and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold">{course.code}</p>
          <p className="text-sm text-muted-foreground">{course.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Section {course.class} • {course.credits} credits
          </p>
        </div>

        {affectedSlots.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-destructive mb-2">
              This will remove the course from:
            </p>
            <ul className="text-sm text-destructive/80 space-y-1">
              {affectedSlots.map((slot, index) => (
                <li key={index}>• {slot}</li>
              ))}
            </ul>
          </div>
        )}

        {affectedSlots.length === 0 && (
          <p className="text-sm text-muted-foreground">
            This course is not currently assigned to any time slots.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirmDelete();
              onOpenChange(false);
            }}
          >
            Delete Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
