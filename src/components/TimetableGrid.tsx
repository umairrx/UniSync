import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  DAYS,
  type Course,
  type TimetableData,
  type DayOfWeek,
  type TimeSlot,
  type TimetableSettings,
} from "@/types";
import { createSlotKey, formatTimeSlotShort, generateTimeSlots } from "@/utils/timetable";
import { useDroppable } from "@dnd-kit/core";

interface TimetableGridProps {
  courses: Course[];
  timetable: TimetableData;
  settings: TimetableSettings;
  onSlotDoubleClick: (day: DayOfWeek, time: TimeSlot) => void;
}

interface DroppableSlotProps {
  day: DayOfWeek;
  time: TimeSlot;
  course?: Course;
  classroom?: string; // New prop
  isSelected: boolean;
  isLastRow: boolean;
  isLastCol: boolean;
  onSlotClick: (day: DayOfWeek, time: TimeSlot) => void;
  onSlotDoubleClick: (day: DayOfWeek, time: TimeSlot) => void;
}

function DroppableSlot({
  day,
  time,
  course,
  classroom,
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

  const displayClassroom = classroom || course?.classroom || "No Room";

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSlotClick(day, time)}
      onDoubleClick={() => onSlotDoubleClick(day, time)}
      className={cn(
        "border-t border-l border-border p-1 cursor-pointer transition-all duration-200 min-h-[70px]",
        "hover:bg-accent/50 flex flex-col items-center justify-center text-center",
        isLastCol && "border-r",
        isLastRow && "border-b",
        isLastRow && isLastCol && "rounded-br-lg",
        isSelected && !course && "bg-accent ring-2 ring-ring",
        course && "bg-primary/10 dark:bg-primary/20",
        isOver && "bg-primary/30 ring-2 ring-primary border-primary",
      )}
    >
      {course ? (
        <div className="text-xs w-full h-full flex flex-col justify-between p-1">
          <div className="text-[10px] text-muted-foreground leading-tight truncate font-medium">
            {course.faculty || "Unknown Faculty"}
          </div>

          <div className="font-bold text-primary dark:text-primary-foreground text-xs line-clamp-2 my-1">
            {course.name}
          </div>

          <div className="text-xs font-bold mt-auto text-foreground/80">
            {displayClassroom}
          </div>
        </div>
      ) : (
        <span
          className={cn(
            "text-muted-foreground text-xs opacity-0 group-hover:opacity-100",
            isOver && "opacity-100 text-primary-foreground",
          )}
        >
          {isOver ? "Drop Here" : "Click to select"}
        </span>
      )}
    </div>
  );
}

export function TimetableGrid({
  courses,
  timetable,
  settings,
  onSlotDoubleClick,
}: TimetableGridProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const timeSlots = useMemo(() => generateTimeSlots(settings), [settings]);

  const getSlotData = (day: DayOfWeek, time: TimeSlot) => {
    const slotKey = createSlotKey(day, time);
    // Handle both legacy string and new object format
    const entry = timetable[slotKey];
    if (!entry) return { course: undefined, classroom: undefined };

    const courseId = typeof entry === 'string' ? entry : entry.courseId;
    const classroom = typeof entry === 'string' ? undefined : entry.classroom;
    
    const course = courses.find((c) => c.id === courseId);
    return { course, classroom };
  };

  const handleSlotClick = (day: DayOfWeek, time: TimeSlot) => {
    const slotKey = createSlotKey(day, time);
    setSelectedSlot((prev) => (prev === slotKey ? null : slotKey));
  };

  const handleSlotDoubleClickWrapper = (day: DayOfWeek, time: TimeSlot) => {
    onSlotDoubleClick(day, time);
    setSelectedSlot(null);
  };

  return (
    <div className="w-full">
      <div
        className="grid w-full border border-border rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `100px repeat(${timeSlots.length}, 1fr)`,
          gridTemplateRows: `auto repeat(${DAYS.length}, minmax(70px, auto))`,
        }}
      >
        <div className="bg-muted text-muted-foreground font-semibold p-2 text-center text-sm rounded-tl-lg sticky left-0 z-10 box-border border-b border-border">
          Day / Time
        </div>
        {timeSlots.map((time, index) => (
          <div
            key={time}
            className={cn(
              "bg-muted text-muted-foreground font-semibold p-2 text-center text-xs whitespace-nowrap border-b border-border",
              index === timeSlots.length - 1 && "rounded-tr-lg",
            )}
          >
            {formatTimeSlotShort(time, settings.intervalMinutes)}
          </div>
        ))}

        {DAYS.map((day, dayIndex) => (
          <>
            <div
              key={`${day}-label`}
              className={cn(
                "bg-muted font-semibold p-2 flex items-center justify-center text-sm border-t border-border sticky left-0 z-10",
                dayIndex === DAYS.length - 1 && "rounded-bl-lg",
              )}
            >
              {day}
            </div>

            {timeSlots.map((time, timeIndex) => {
              const slotKey = createSlotKey(day, time);
              const { course, classroom } = getSlotData(day, time);
              const isSelected = selectedSlot === slotKey;
              const isLastRow = dayIndex === DAYS.length - 1;
              const isLastCol = timeIndex === timeSlots.length - 1;

              return (
                <DroppableSlot
                  key={slotKey}
                  day={day}
                  time={time}
                  course={course}
                  classroom={classroom}
                  isSelected={isSelected}
                  isLastRow={isLastRow}
                  isLastCol={isLastCol}
                  onSlotClick={handleSlotClick}
                  onSlotDoubleClick={handleSlotDoubleClickWrapper}
                />
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
