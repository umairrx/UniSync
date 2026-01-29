import { useState, useCallback, useEffect } from "react";
import { Trash2, BookOpen, Calendar } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  TimetableGrid,
  CourseList,
  AddCourseModal,
  ImportTimetableModal,
  ImportCoursesModal,
  AssignCourseModal,
  DeleteCourseModal,
  ClearConfirmationDialog,
  CreditsDisplay,
} from "@/components";
import { SettingsModal } from "@/components/SettingsModal";
import ModeToggle from "@/components/mode-toggle";
import { useCourses, useTimetable, useCredits, useSettings } from "@/hooks/useTimetable";
import { createSlotKey } from "@/utils/timetable";
import type { Course, DayOfWeek, TimeSlot } from "@/types";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { Badge } from "./components/ui/badge";

function App() {
  const { courses, addCourse, deleteCourse, clearCourses, getCourseById } = useCourses();
  const {
    timetable,
    assignCourse,
    removeCourseFromSlot,
    removeCourseFromAllSlots,
    clearTimetable,
    getSlotCourseId,
  } = useTimetable();
  const { totalCredits, scheduledCredits } = useCredits(courses, timetable);
  const { settings, setSettings } = useSettings();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clearCoursesDialogOpen, setClearCoursesDialogOpen] = useState(false);
  const [clearTimetableDialogOpen, setClearTimetableDialogOpen] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState<{
    day: DayOfWeek;
    time: TimeSlot;
  } | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [activeDragCourse, setActiveDragCourse] = useState<Course | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor),
  );

  const handleSlotDoubleClick = useCallback((day: DayOfWeek, time: TimeSlot) => {
    setSelectedSlot({ day, time });
    setAssignModalOpen(true);
  }, []);

  const handleAssignCourse = useCallback(
    (courseId: string) => {
      if (selectedSlot) {
        const slotKey = createSlotKey(selectedSlot.day, selectedSlot.time);
        assignCourse(slotKey, courseId);
      }
    },
    [selectedSlot, assignCourse],
  );

  const handleRemoveCourseFromSlot = useCallback(() => {
    if (selectedSlot) {
      const slotKey = createSlotKey(selectedSlot.day, selectedSlot.time);
      removeCourseFromSlot(slotKey);
    }
  }, [selectedSlot, removeCourseFromSlot]);

  const handleDeleteCourseRequest = useCallback(
    (courseId: string) => {
      const course = getCourseById(courseId);
      if (course) {
        setCourseToDelete(course);
        setDeleteModalOpen(true);
      }
    },
    [getCourseById],
  );

  const handleConfirmDelete = useCallback(() => {
    if (courseToDelete) {
      removeCourseFromAllSlots(courseToDelete.id);
      deleteCourse(courseToDelete.id);
      setCourseToDelete(null);
    }
  }, [courseToDelete, deleteCourse, removeCourseFromAllSlots]);

  const handleConfirmClearCourses = useCallback(() => {
    clearCourses();
    clearTimetable();
  }, [clearCourses, clearTimetable]);

  const handleConfirmClearTimetable = useCallback(() => {
    clearTimetable();
  }, [clearTimetable]);

  const getAssignedCourseId = () => {
    if (!selectedSlot) return undefined;
    const slotKey = createSlotKey(selectedSlot.day, selectedSlot.time);
    return getSlotCourseId(slotKey);
  };

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.course) {
      setActiveDragCourse(event.active.data.current.course);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragCourse(null);
    const { active, over } = event;

    if (over && active.data.current?.type === "course") {
      const course = active.data.current.course as Course;

      const slotKey = over.id as string;

      assignCourse(slotKey, course.id);
    }
  };

  return (
    <TooltipProvider>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="min-h-screen bg-background">
          <header className="bg-card text-card-foreground border-b shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {mounted ? (
                    <img
                      src={resolvedTheme === "dark" ? "/white.svg" : "/black.svg"}
                      alt="TIME Logo"
                      className="h-20 w-auto object-contain"
                    />
                  ) : (
                    <div className="h-20 w-20" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <SettingsModal settings={settings} onSave={setSettings} />
                  <ModeToggle />
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-start gap-2 text-lg">
                      <BookOpen className="h-5 w-5 mt-1 shrink-0" />
                      <span>Available Courses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CreditsDisplay
                      totalCredits={totalCredits}
                      scheduledCredits={scheduledCredits}
                    />

                    <Separator />

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <AddCourseModal courses={courses} onAddCourse={addCourse} />
                        </div>
                        <div className="flex-1">
                          <ImportCoursesModal onAddCourse={addCourse} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <ImportTimetableModal
                            courses={courses}
                            onImportTimetable={(
                              assignments: { slotKey: string; courseId: string; classroom?: string }[],
                            ) => {
                              assignments.forEach(({ slotKey, courseId, classroom }) => {
                                assignCourse(slotKey, { courseId, classroom });
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setClearCoursesDialogOpen(true)}
                          disabled={courses.length === 0}
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear Courses
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setClearTimetableDialogOpen(true)}
                          disabled={Object.keys(timetable).length === 0}
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear Timetable
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <CourseList courses={courses} onDeleteCourse={handleDeleteCourseRequest} />
                  </CardContent>
                </Card>
              </div>

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
                      courses={courses}
                      timetable={timetable}
                      settings={settings}
                      onSlotDoubleClick={handleSlotDoubleClick}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>

          <AssignCourseModal
            open={assignModalOpen}
            onOpenChange={setAssignModalOpen}
            day={selectedSlot?.day ?? null}
            time={selectedSlot?.time ?? null}
            courses={courses}
            assignedCourseId={getAssignedCourseId()}
            onAssignCourse={handleAssignCourse}
            onRemoveCourse={handleRemoveCourseFromSlot}
          />

          <DeleteCourseModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            course={courseToDelete}
            timetable={timetable}
            onConfirmDelete={handleConfirmDelete}
          />

          <ClearConfirmationDialog
            open={clearCoursesDialogOpen}
            onOpenChange={setClearCoursesDialogOpen}
            title="Clear All Courses?"
            description="Are you sure you want to delete all courses? This action cannot be undone and will also clear the timetable."
            onConfirm={handleConfirmClearCourses}
          />

          <ClearConfirmationDialog
            open={clearTimetableDialogOpen}
            onOpenChange={setClearTimetableDialogOpen}
            title="Clear Timetable?"
            description="Are you sure you want to clear all assignments from the timetable? This action cannot be undone."
            onConfirm={handleConfirmClearTimetable}
          />

          <DragOverlay>
            {activeDragCourse ? (
              <div className="flex items-center justify-between p-3 bg-background rounded-lg shadow-xl border border-primary w-[250px] opacity-90">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{activeDragCourse.code}</span>
                    <Badge variant="secondary" className="text-xs">
                      Sec {activeDragCourse.class}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </TooltipProvider>
  );
}

export default App;
