import { useState } from "react";
import { MapPin, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Course, DayOfWeek, TimeSlot } from "@/types";
import { formatTime } from "@/utils/timetable";

interface AssignCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: DayOfWeek | null;
  time: TimeSlot | null;
  courses: Course[];
  assignedCourseId: string | undefined;
  onAssignCourse: (courseId: string) => void;
  onRemoveCourse: () => void;
}

export function AssignCourseModal({
  open,
  onOpenChange,
  day,
  time,
  courses,
  assignedCourseId,
  onAssignCourse,
  onRemoveCourse,
}: AssignCourseModalProps) {
  const [error, setError] = useState<string>("");

  const assignedCourse = assignedCourseId
    ? courses.find((c) => c.id === assignedCourseId)
    : undefined;

  if (!day || !time) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Assign Course to Slot
          </DialogTitle>
          <DialogDescription>
            {day}, {formatTime(time)}
          </DialogDescription>
        </DialogHeader>

        {assignedCourse && (
          <>
            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary dark:text-primary-foreground">
                    Currently Assigned
                  </p>
                  <p className="text-sm font-medium">{assignedCourse.code}</p>
                  <p className="text-xs text-muted-foreground">{assignedCourse.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Sec {assignedCourse.class}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {assignedCourse.credits} credits
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onRemoveCourse();
                    onOpenChange(false);
                  }}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">
            {assignedCourse ? "Replace with another course:" : "Select a course to assign:"}
          </p>

          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No courses available. Add some courses first.
            </p>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      try {
                        setError("");
                        onAssignCourse(course.id);
                        onOpenChange(false);
                      } catch (error) {
                        setError(
                          error instanceof Error ? error.message : "Failed to assign course",
                        );
                      }
                    }}
                    disabled={course.id === assignedCourseId}
                    className="w-full p-3 text-left rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{course.code}</p>
                        <p className="text-xs text-muted-foreground">{course.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          Sec {course.class}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.credits} cr
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
