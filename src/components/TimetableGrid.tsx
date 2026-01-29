import { useState, useMemo, forwardRef, Fragment, useCallback, memo } from "react";
import { ZoomOut, ZoomIn, RotateCcw, MousePointer2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DAYS,
  type Course,
  type TimetableData,
  type DayOfWeek,
  type TimeSlot,
  type TimetableSettings,
} from "@/types";
import { createSlotKey, formatTimeSlotShort, formatTimeSlotStartOnly, generateTimeSlots } from "@/utils/timetable";
import { useDroppable, useDraggable } from "@dnd-kit/core";

interface TimetableGridProps {
  courses: Course[];
  timetable: TimetableData;
  settings: TimetableSettings;
  onSlotDoubleClick: (day: DayOfWeek, time: TimeSlot) => void;
}

interface SlotEntryData {
  course: Course;
  classroom?: string;
}

interface DroppableSlotProps {
  day: DayOfWeek;
  time: TimeSlot;
  entries: SlotEntryData[];
  isSelected: boolean;
  isLastRow: boolean;
  isLastCol: boolean;
  onSlotClick: (day: DayOfWeek, time: TimeSlot) => void;
  onSlotDoubleClick: (day: DayOfWeek, time: TimeSlot) => void;
}

const DraggableGridEntry = memo(function DraggableGridEntry({
  entry,
  slotKey,
  isClash,
}: {
  entry: SlotEntryData;
  slotKey: string;
  isClash: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `grid-${slotKey}-${entry.course.id}`,
    data: {
      type: "course",
      course: entry.course,
      classroom: entry.classroom,
      sourceSlotKey: slotKey,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const displayClassroom = entry.classroom || entry.course.classroom || "No Room";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "text-[10px] w-full flex flex-col justify-between p-1 rounded transition-colors cursor-grab active:cursor-grabbing relative group/entry",
        isClash && "bg-background/50 border border-border/50 py-1.5 h-auto",
        !isClash && "h-full",
        isDragging && "opacity-0",
      )}
    >
      <div className="text-[7px] sm:text-[8px] text-muted-foreground leading-tight truncate font-medium">
        {entry.course.faculty || "Unknown Faculty"}
      </div>

      <div className="font-bold text-foreground text-[8px] sm:text-[10px] line-clamp-2 my-0.5">
        {entry.course.name}
      </div>

      <div className="text-[7px] sm:text-[9px] font-bold mt-auto text-foreground/80">
        {displayClassroom}
      </div>
    </div>
  );
});

const DroppableSlot = memo(function DroppableSlot({
  day,
  time,
  entries,
  isSelected,
  isLastRow,
  isLastCol,
  onSlotClick,
  onSlotDoubleClick,
}: DroppableSlotProps) {
  const slotKey = createSlotKey(day, time);
  const { setNodeRef, isOver } = useDroppable({
    id: slotKey,
    data: { day, time },
  });

  const hasEntries = entries.length > 0;
  const isClash = entries.length > 1;

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSlotClick(day, time)}
      onDoubleClick={() => onSlotDoubleClick(day, time)}
      title={
        hasEntries
          ? `${entries.map((e) => e.course.code).join(", ")}`
          : "Double-click to assign a course"
      }
      className={cn(
        "border-t border-l border-border p-1 sm:p-1.5 cursor-pointer transition-all duration-200 min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-center text-center group",
        "hover:bg-accent/50",
        isLastCol && "border-r",
        isLastRow && "border-b",
        isLastRow && isLastCol && "rounded-br-lg",
        isSelected && !hasEntries && "bg-accent ring-2 ring-ring",
        hasEntries && "bg-primary/5 dark:bg-primary/10",
        isClash && "bg-secondary dark:bg-secondary/40",
        isOver && "bg-primary/30 ring-2 ring-primary border-primary",
      )}
    >
      {hasEntries ? (
        <div className={cn("w-full h-full flex gap-1", isClash ? "flex-col" : "flex-row")}>
          {entries.map((entry, idx) => (
            <DraggableGridEntry
              key={`${entry.course.id}-${idx}`}
              entry={entry}
              slotKey={slotKey}
              isClash={isClash}
            />
          ))}
        </div>
      ) : (
        <span
          className={cn(
            "text-muted-foreground opacity-0 group-hover:opacity-100 text-[7px] sm:text-[9px]",
            isOver && "opacity-100 text-primary-foreground",
          )}
        >
          {isOver ? "Drop Here" : "Double-click to assign"}
        </span>
      )}
    </div>
  );
});

export const TimetableGrid = memo(
  forwardRef<HTMLDivElement, TimetableGridProps>(
    ({ courses, timetable, settings, onSlotDoubleClick }, ref) => {
      const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
      const [zoom, setZoom] = useState(100);

      const timeSlots = useMemo(() => generateTimeSlots(settings), [settings]);

      const courseMap = useMemo(() => {
        const map = new Map<string, Course>();
        courses.forEach((c) => map.set(c.id, c));
        return map;
      }, [courses]);

      // Pre-calculate all slot data to avoid expensive operations during render
      const processedTimetable = useMemo(() => {
        const data: Record<string, SlotEntryData[]> = {};

        // We can't just iterate the timetable keys because we need to support lookup by slotKey
        // actually, we can, and just store them in the map.
        // But creating the full map of ALL generic slots isn't needed, just the ones with data?
        // No, for the render loop below, we access `processedTimetable[slotKey]`.
        // So populate it with valid data.

        Object.entries(timetable).forEach(([key, entries]) => {
          if (!entries || entries.length === 0) return;

          const validEntries = entries
            .map((entry): SlotEntryData | null => {
              const course = courseMap.get(entry.courseId);
              if (!course) return null;
              return { course, classroom: entry.classroom };
            })
            .filter((x): x is SlotEntryData => x !== null);

          if (validEntries.length > 0) {
            data[key] = validEntries;
          }
        });
        return data;
      }, [timetable, courseMap]);

      const handleSlotClick = useCallback((day: DayOfWeek, time: TimeSlot) => {
        const slotKey = createSlotKey(day, time);
        if (selectedSlot === slotKey) {
          // Second click on the same slot - open modal (for mobile reliability)
          onSlotDoubleClick(day, time);
          setSelectedSlot(null);
        } else {
          setSelectedSlot(slotKey);
        }
      }, [selectedSlot, onSlotDoubleClick]);

      const handleSlotDoubleClickWrapper = useCallback(
        (day: DayOfWeek, time: TimeSlot) => {
          onSlotDoubleClick(day, time);
          setSelectedSlot(null);
        },
        [onSlotDoubleClick],
      );

      return (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
                title="Zoom out"
                aria-label="Decrease timetable zoom"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center" aria-live="polite">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
                title="Zoom in"
                aria-label="Increase timetable zoom"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setZoom(100)} 
                title="Reset zoom"
                aria-label="Reset timetable zoom to 100%"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MousePointer2 className="h-3 w-3 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-foreground">Pro Tip</p>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  Double-click any empty slot to manually assign a course or update rooms.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full relative">
            {courses.length === 0 && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-background/60 backdrop-blur-[2px] rounded-xl border border-dashed border-primary/20 animate-in fade-in zoom-in duration-300">
                <div className="bg-card p-6 rounded-2xl shadow-xl border border-border max-w-sm text-center space-y-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">No Courses Added</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You need to add your courses to the list before you can start building your timetable.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                zoom: zoom / 100,
                width: "100%",
                height: "fit-content",
              }}
            >
              <div
                ref={ref}
                className="grid bg-background rounded-lg border border-border p-1"
                style={{
                  gridTemplateColumns: `minmax(35px, 50px) repeat(${timeSlots.length}, minmax(0, 1fr))`,
                  gridTemplateRows: `auto repeat(${DAYS.length}, minmax(50px, auto))`,
                }}
              >
                <div className="bg-muted text-muted-foreground font-semibold p-1 text-center text-[9px] sm:text-[10px] flex items-center justify-center rounded-tl-lg z-10 box-border border-b border-r border-border">
                  Day / Time
                </div>
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className={cn(
                      "bg-muted text-muted-foreground font-semibold p-1 text-center text-[9px] sm:text-[10px] whitespace-nowrap border-b border-border flex items-center justify-center",
                      index !== timeSlots.length - 1 && "border-r",
                      index === timeSlots.length - 1 && "rounded-tr-lg",
                    )}
                  >
                    <span className="hidden sm:inline">{formatTimeSlotShort(time, settings.intervalMinutes)}</span>
                    <span className="sm:hidden">{formatTimeSlotStartOnly(time)}</span>
                  </div>
                ))}

                {DAYS.map((day, dayIndex) => (
                  <Fragment key={day}>
                    <div
                      className={cn(
                        "bg-muted font-semibold p-1 flex items-center justify-center text-[9px] sm:text-[10px] border-r border-border z-10",
                        dayIndex !== 0 && "border-t",
                        dayIndex === DAYS.length - 1 && "rounded-bl-lg",
                      )}
                    >
                      <span className="sm:writing-mode-horizontal">
                        {day.substring(0, 3)}
                      </span>
                    </div>

                    {timeSlots.map((time, timeIndex) => {
                      const slotKey = createSlotKey(day, time);
                      const entries = processedTimetable[slotKey] || [];
                      const isSelected = selectedSlot === slotKey;
                      const isLastRow = dayIndex === DAYS.length - 1;
                      const isLastCol = timeIndex === timeSlots.length - 1;

                      return (
                        <DroppableSlot
                          key={slotKey}
                          day={day}
                          time={time}
                          entries={entries}
                          isSelected={isSelected}
                          isLastRow={isLastRow}
                          isLastCol={isLastCol}
                          onSlotClick={handleSlotClick}
                          onSlotDoubleClick={handleSlotDoubleClickWrapper}
                        />
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    },
  ),
);
TimetableGrid.displayName = "TimetableGrid";
