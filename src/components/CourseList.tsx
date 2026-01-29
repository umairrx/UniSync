import { Trash2, BookOpen, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";

interface CourseListProps {
  courses: Course[];
  onDeleteCourse: (courseId: string) => void;
}

function DraggableCourseItem({
  course,
  onDelete,
}: {
  course: Course;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `course-${course.id}`,
    data: {
      type: "course",
      course,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-3 bg-muted/50 rounded-lg transition-colors border border-transparent",
        isDragging && "opacity-50 ring-2 ring-primary border-primary bg-background shadow-xl z-50",
        !isDragging && "hover:bg-muted",
      )}
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-move mr-2 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm truncate">{course.code}</span>
          <Badge variant="secondary" className="text-xs">
            Sec {course.class}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {course.credits} cr
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{course.name}</p>
        {course.faculty && (
          <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5">{course.faculty}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 ml-2"
        onClick={() => onDelete(course.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function CourseList({ courses, onDeleteCourse }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-sm">No courses added yet</p>
        <p className="text-xs">Click "Add Course" to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {courses.map((course) => (
          <DraggableCourseItem key={course.id} course={course} onDelete={onDeleteCourse} />
        ))}
      </div>
    </ScrollArea>
  );
}
