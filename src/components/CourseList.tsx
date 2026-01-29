import { BookOpen, LayoutList, LayoutGrid, List, MousePointer2, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";
import { ICON_SIZES } from "@/constants/design-tokens";

type ViewMode = "list" | "grid" | "compact";

interface CourseListProps {
  courses: Course[];
  onDeleteCourse?: (course: Course) => void;
}

function DraggableCourseItem({
  course,
  viewMode,
  onDelete,
}: {
  course: Course;
  viewMode: ViewMode;
  onDelete?: (course: Course) => void;
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(course);
  };

  if (viewMode === "compact") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn(
          "group flex items-center gap-2 p-1.5 bg-card hover:bg-accent/50 rounded-md border transition-all shadow-sm cursor-grab active:cursor-grabbing touch-none",
          isDragging &&
            "opacity-50 ring-2 ring-primary border-primary bg-background shadow-xl z-50",
        )}
      >
        <div className="flex-1 min-w-0 flex items-center gap-2 font-bold">
          <span className="text-[10px] text-muted-foreground truncate flex-1 min-w-0">
            {course.name}
          </span>
          <Badge
            variant="secondary"
            className="text-[8px] h-4 px-1 shrink-0 font-normal bg-secondary/40 text-secondary-foreground border-secondary/50"
          >
            {course.class}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className={ICON_SIZES.TINY} />
          </Button>
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn(
          "group relative flex flex-col gap-1 p-2.5 bg-card hover:bg-accent/50 rounded-xl border transition-all shadow-sm min-h-[110px] cursor-grab active:cursor-grabbing touch-none",
          isDragging &&
            "opacity-50 ring-2 ring-primary border-primary bg-background shadow-xl z-50",
        )}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className={ICON_SIZES.SMALL} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <span className="font-bold text-sm truncate leading-tight text-foreground/90">
            {course.code}
          </span>
          <span
            className="text-[10px] text-muted-foreground line-clamp-2 leading-tight h-7 min-w-0"
            title={course.name}
          >
            {course.name}
          </span>
        </div>

        <div className="pt-2 mt-auto">
          <Badge
            variant="secondary"
            className="text-[9px] h-5 px-1.5 truncate max-w-full font-mono font-medium bg-secondary/40 text-secondary-foreground border-secondary/50"
          >
            {course.class}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group flex items-start gap-3 p-2.5 bg-card hover:bg-accent/50 rounded-xl border transition-all shadow-sm cursor-grab active:cursor-grabbing touch-none",
        isDragging && "opacity-50 ring-2 ring-primary border-primary bg-background shadow-xl z-50",
      )}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <span className="font-bold text-sm leading-none truncate text-foreground/90">
              {course.code}
            </span>
            <span
              className="text-[10px] text-muted-foreground truncate leading-tight min-w-0"
              title={course.name}
            >
              {course.name}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Trash2 className={ICON_SIZES.SMALL} />
            </Button>
            <Badge variant="outline" className="text-[9px] px-1 h-5 font-medium border-primary/20">
              {course.credits} Cr
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 h-5 truncate font-mono font-medium bg-secondary/40 text-secondary-foreground border-secondary/50"
            title={course.class}
          >
            {course.class}
          </Badge>
          {course.faculty && (
            <span
              className="text-[9px] text-muted-foreground truncate flex-1 text-right max-w-[120px] min-w-0"
              title={course.faculty}
            >
              {course.faculty}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CourseList({ courses, onDeleteCourse }: CourseListProps) {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("course_list_view_mode", "list");

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
    <TooltipProvider delayDuration={200}>
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Course Display
          </span>
          <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/50">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("list")}
              className="h-6 w-6"
              title="List View"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("grid")}
              className="h-6 w-6"
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "compact" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("compact")}
              className="h-6 w-6"
              title="Compact View"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-2 px-2 py-2 rounded-lg bg-secondary/10 border border-secondary/20 mb-3">
          <MousePointer2 className="h-3 w-3 text-secondary-foreground/70 mt-0.5 shrink-0" />
          <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
            <span className="text-secondary-foreground font-bold">Pro Tip:</span> Drag any course
            card directly onto the timetable grid to assign it to a slot.
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-450px)] min-h-[300px] sm:min-h-[400px] rounded-md border p-1.5 sm:p-2 bg-muted/10 *:data-[slot=scroll-area-scrollbar]:hidden">
          <div
            className={cn(
              "no-scrollbar px-1",
              viewMode === "grid" ? "grid grid-cols-2 gap-2" : "space-y-1.5 sm:space-y-2",
            )}
          >
            {courses.map((course) => (
              <DraggableCourseItem
                key={course.id}
                course={course}
                viewMode={viewMode}
                onDelete={onDeleteCourse}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
