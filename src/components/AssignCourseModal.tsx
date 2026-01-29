import { useMemo } from "react";
import { MapPin, X, Search, School, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import type { Course, DayOfWeek, TimeSlot, TimetableEntry } from "@/types";
import { formatTime } from "@/utils/timetable";
import { useCoursesSearch, useClassroomManagement } from "@/hooks";

interface AssignCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: DayOfWeek | null;
  time: TimeSlot | null;
  courses: Course[];
  assignedEntries: TimetableEntry[];
  onAssignCourse: (courseId: string, classroom?: string) => void;
  onRemoveCourse: (courseId: string) => void;
}

export function AssignCourseModal({
  open,
  onOpenChange,
  day,
  time,
  courses,
  assignedEntries,
  onAssignCourse,
  onRemoveCourse,
}: AssignCourseModalProps) {
  const { searchQuery, setSearchQuery, filteredCourses } = useCoursesSearch(courses);
  const {
    editingRoomCourseId,
    editRoomValue,
    setEditRoomValue,
    classroomOverride,
    setClassroomOverride,
    startEditing,
    stopEditing,
  } = useClassroomManagement();

  const assignedCourseDetails = useMemo(() => {
    return assignedEntries
      .map((entry) => {
        const course = courses.find((c) => c.id === entry.courseId);
        if (!course) return null;
        return {
          ...course,
          displayRoom: entry.classroom || course.classroom || "No Room",
        };
      })
      .filter((c): c is Course & { displayRoom: string } => c !== null);
  }, [assignedEntries, courses]);

  const assignedCourseIds = useMemo(
    () => assignedEntries.map((e) => e.courseId),
    [assignedEntries],
  );

  const handleAssign = (courseId: string) => {
    onAssignCourse(courseId, classroomOverride.trim() || undefined);
    onOpenChange(false);
    setSearchQuery("");
    setClassroomOverride("");
  };

  if (!day || !time) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl flex flex-col h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Manage Slot Assignment
          </DialogTitle>
          <DialogDescription>
            {day}, {formatTime(time)}
          </DialogDescription>
        </DialogHeader>

        {assignedCourseDetails.length > 0 && (
          <div className="space-y-2 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block px-1">
              Current Assignments ({assignedCourseDetails.length})
            </span>
            <div className="grid grid-cols-1 gap-2">
              {assignedCourseDetails.map((course) => {
                const isEditing = editingRoomCourseId === course.id;

                return (
                  <div
                    key={course.id}
                    className="bg-muted/50 border border-border rounded-lg p-3 flex items-center justify-between group transition-all hover:bg-muted/80"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm truncate">{course.code}</span>
                        <Badge variant="secondary" className="text-[10px] h-4 shrink-0">
                          {course.class}
                        </Badge>

                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <Input
                              size={1}
                              className="h-6 text-[10px] w-24 px-1.5 focus-visible:ring-1"
                              value={editRoomValue}
                              onChange={(e) => setEditRoomValue(e.target.value)}
                              placeholder="Enter room..."
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  onAssignCourse(course.id, editRoomValue.trim() || undefined);
                                  stopEditing();
                                } else if (e.key === "Escape") {
                                  stopEditing();
                                }
                              }}
                            />
                            <Button
                              size="icon-xs"
                              variant="ghost"
                              className="h-6 w-6 text-primary hover:bg-primary/10"
                              onClick={() => {
                                onAssignCourse(course.id, editRoomValue.trim() || undefined);
                                stopEditing();
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon-xs"
                              variant="ghost"
                              className="h-6 w-6 text-muted-foreground"
                              onClick={stopEditing}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] h-4 shrink-0 border-primary/30 text-primary cursor-pointer hover:bg-primary/5 transition-colors gap-1 group/room"
                            onClick={() => startEditing(course.id, course.displayRoom)}
                          >
                            {course.displayRoom}
                            <Pencil className="h-2 w-2 opacity-0 group-hover/room:opacity-100 transition-opacity" />
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {course.name}
                      </span>
                    </div>
                    {!isEditing && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => startEditing(course.id, course.displayRoom)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onRemoveCourse(course.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span className="sr-only">Unassign</span>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4 flex-1 flex flex-col overflow-hidden min-h-0 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <School className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Room Override (Optional)"
                className="pl-9"
                value={classroomOverride}
                onChange={(e) => setClassroomOverride(e.target.value)}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground px-1">
            {assignedCourseDetails.length > 0
              ? "Select an additional course to create a clash assignment."
              : "Select a course below to assign it to this slot."}
          </div>

          <ScrollArea
            type="scroll"
            className="flex-1 border rounded-md bg-muted/20 overflow-hidden"
          >
            {filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground h-full">
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p>No courses found</p>
              </div>
            ) : (
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-4">
                  {filteredCourses.map((course) => {
                    const isAssigned = assignedCourseIds.includes(course.id);
                    return (
                      <button
                        key={course.id}
                        onClick={() => handleAssign(course.id)}
                        className={cn(
                          "flex flex-col items-start text-left p-3 rounded-md border transition-all group overflow-hidden relative",
                          isAssigned
                            ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
                            : "border-border bg-background hover:border-primary hover:bg-accent hover:shadow-sm",
                        )}
                      >
                        {isAssigned && (
                          <div className="absolute top-0 right-0 bg-primary text-[8px] text-primary-foreground px-1.5 py-0.5 rounded-bl-lg font-bold uppercase tracking-tighter">
                            Assigned
                          </div>
                        )}
                        <div className="flex items-center justify-between w-full mb-1 gap-2 min-w-0">
                          <span className="font-bold text-sm group-hover:text-primary transition-colors truncate">
                            {course.code}
                          </span>
                          <Badge variant="outline" className="text-[10px] h-5 shrink-0">
                            {course.credits} Cr
                          </Badge>
                        </div>
                        <div className="text-xs font-medium text-foreground/90 line-clamp-1 mb-1 w-full">
                          {course.name}
                        </div>
                        <div className="flex items-center justify-between w-full mt-auto gap-2 min-w-0">
                          <div className="flex gap-1 items-center overflow-hidden">
                            <Badge variant="secondary" className="text-[10px] px-1 h-5 shrink-0">
                              {course.class}
                            </Badge>
                            {isAssigned && (
                              <span className="text-[9px] text-primary font-bold whitespace-nowrap">
                                Click to update room
                              </span>
                            )}
                          </div>
                          {course.faculty && (
                            <span className="text-[10px] text-muted-foreground truncate">
                              {course.faculty}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
