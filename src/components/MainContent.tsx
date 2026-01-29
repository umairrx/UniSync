import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimetableGrid } from "@/components/TimetableGrid";
import type { DayOfWeek, TimeSlot, Course } from "@/types";

interface MainContentProps {
  timetableRef: React.RefObject<HTMLDivElement>;
  courses: Course[];
  timetable: Record<string, any[]>;
  settings: any;
  onSlotDoubleClick: (day: DayOfWeek, time: TimeSlot) => void;
}

export function MainContent({
  timetableRef,
  courses,
  timetable,
  settings,
  onSlotDoubleClick,
}: MainContentProps) {
  return (
    <div className="lg:col-span-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Weekly Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableGrid
            ref={timetableRef}
            courses={courses}
            timetable={timetable}
            settings={settings}
            onSlotDoubleClick={onSlotDoubleClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}
