import { useCallback, useEffect, useMemo } from "react";
import { Trash2, BookOpen, Calendar, Download, Loader2, MousePointer2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TimetableGrid } from "@/components/TimetableGrid";
import { CourseList } from "@/components/CourseList";
import { AddCourseModal } from "@/components/AddCourseModal";
import { ImportTimetableModal } from "@/components/ImportTimetableModal";
import { ImportCoursesModal } from "@/components/ImportCoursesModal";
import { AssignCourseModal } from "@/components/AssignCourseModal";
import { DeleteCourseModal } from "@/components/DeleteCourseModal";
import { ClearConfirmationDialog } from "@/components/ClearConfirmationDialog";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { TimetableImageUpload } from "@/components/TimetableImageUpload";
import { TimetableImageGallery } from "@/components/TimetableImageGallery";
import { SEO } from "@/components/SEO";
import { SettingsModal } from "@/components/SettingsModal";
import ModeToggle from "@/components/mode-toggle";
import {
  useCourses,
  useTimetable,
  useSettings,
  useTimetableImages,
  useModalState,
  useSlotSelection,
  useTimetableDragDrop,
  useTimetableExport,
} from "@/hooks";
import { calculateCredits } from "@/utils/credits";
import { createSlotKey, migrateTimetableOnSettingsChange } from "@/utils/timetable";
import type { DayOfWeek, TimeSlot, Course } from "@/types";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Static JSX elements hoisted outside component
const GettingStartedSection = () => (
  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm mb-2">
    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <MousePointer2 className="h-3 w-3 text-primary" />
    </div>
    <div className="space-y-0.5">
      <p className="text-[11px] font-bold text-foreground">Getting Started</p>
      <p className="text-[10px] leading-relaxed text-muted-foreground">
        1. Add your courses manually or import a JSON. <br />
        2. Drag cards to the grid or double-click slots. <br />
        3. Export your perfect timetable as a PNG!
      </p>
    </div>
  </div>
);

const ReferenceImagesDescription = () => (
  <div className="flex items-start gap-2 px-2 py-1.5 rounded-lg bg-accent/10 border border-accent/20 mb-2">
    <MousePointer2 className="h-2.5 w-2.5 text-accent-foreground/70 mt-0.5 shrink-0" />
    <p className="text-[9px] leading-tight text-muted-foreground">
      Upload your university's official timetable image to keep it side-by-side for quick reference.
    </p>
  </div>
);

export default function TimetablePage() {
  const { courses, addCourse, deleteCourse, clearCourses, getCourseById } = useCourses();
  const {
    timetable,
    setTimetable,
    assignCourse,
    removeCourseFromSlot,
    removeCourseFromAllSlots,
    clearTimetable,
    getSlotEntries,
  } = useTimetable();

  const { settings, setSettings } = useSettings();
  const { images: timetableImages, addImage, deleteImage, clearImages } = useTimetableImages();

  const { totalCredits, scheduledCredits } = useMemo(
    () => calculateCredits(courses, timetable),
    [courses, timetable],
  );

  const { resolvedTheme } = useTheme();

  const modalState = useModalState();
  const slotSelection = useSlotSelection();
  const { timetableRef, isExporting, exportError, handleExportPng } =
    useTimetableExport(resolvedTheme);
  const dragDrop = useTimetableDragDrop(getCourseById, assignCourse, removeCourseFromSlot);

  const handleSettingsSave = useCallback(
    (newSettings: typeof settings) => {
      const isTimeChanged =
        newSettings.startTime !== settings.startTime ||
        newSettings.endTime !== settings.endTime ||
        newSettings.intervalMinutes !== settings.intervalMinutes;

      if (isTimeChanged) {
        const migratedTimetable = migrateTimetableOnSettingsChange(
          timetable,
          settings,
          newSettings,
        );

        setTimetable(migratedTimetable);

        const assignmentCount = Object.keys(migratedTimetable).length;
        if (assignmentCount > 0) {
          toast.success(
            `Settings updated. ${assignmentCount} assignments have been migrated to the new schedule.`,
          );
        } else {
          toast.success("Settings updated.");
        }
      } else {
        toast.success("Settings updated.");
      }
      setSettings(newSettings);
    },
    [settings, timetable, setSettings, setTimetable],
  );

  const { setAssignModalOpen, setDeleteModalOpen } = modalState;
  const { handleSlotDoubleClick: onSlotSelect, setCourseToDelete } = slotSelection;

  const handleSlotDoubleClick = useCallback(
    (day: DayOfWeek, time: TimeSlot) => {
      onSlotSelect(day, time);
      setAssignModalOpen(true);
    },
    [onSlotSelect, setAssignModalOpen],
  );

  const handleAssignCourse = useCallback(
    (courseId: string, classroom?: string) => {
      if (slotSelection.selectedSlot) {
        const slotKey = createSlotKey(
          slotSelection.selectedSlot.day,
          slotSelection.selectedSlot.time,
        );
        assignCourse(slotKey, { courseId, classroom });
      }
    },
    [slotSelection.selectedSlot, assignCourse],
  );

  const handleRemoveCourseFromSlot = useCallback(
    (courseId?: string) => {
      if (slotSelection.selectedSlot && courseId) {
        const slotKey = createSlotKey(
          slotSelection.selectedSlot.day,
          slotSelection.selectedSlot.time,
        );
        removeCourseFromSlot(slotKey, courseId);
      }
    },
    [slotSelection.selectedSlot, removeCourseFromSlot],
  );

  const handleDeleteCourseRequest = useCallback(
    (course: Course) => {
      setCourseToDelete(course);
      setDeleteModalOpen(true);
    },
    [setCourseToDelete, setDeleteModalOpen],
  );

  const handleImportTimetable = useCallback(
    (
      assignments: {
        slotKey: string;
        courseId: string;
        classroom?: string;
      }[],
      clearExisting: boolean,
      missingCourses: { code: string; section?: string; name: string }[],
    ) => {
      if (clearExisting) {
        clearTimetable();
      }

      const tempIdToRealId: Record<string, string> = {};
      missingCourses.forEach((mc) => {
        const newCourse = addCourse({
          code: mc.code,
          class: mc.section || "A",
          name: mc.name,
          credits: 3,
        });
        const key = `temp-${mc.code}-${mc.section || "DEFAULT"}`;
        tempIdToRealId[key] = newCourse.id;
      });

      assignments.forEach(({ slotKey, courseId, classroom }) => {
        const finalCourseId = courseId.startsWith("temp-") ? tempIdToRealId[courseId] : courseId;

        if (finalCourseId) {
          assignCourse(slotKey, { courseId: finalCourseId, classroom });
        }
      });

      if (missingCourses.length > 0) {
        toast.success(
          `Imported ${assignments.length} assignments and created ${missingCourses.length} missing courses.`,
        );
      } else {
        toast.success(`Imported ${assignments.length} assignments.`);
      }
    },
    [addCourse, assignCourse, clearTimetable],
  );

  useEffect(() => {
    const courseIds = new Set(courses.map((c) => c.id));

    setTimetable((prev) => {
      let hasChanges = false;
      const newTimetable: typeof prev = {};

      Object.keys(prev).forEach((key) => {
        const originalEntries = prev[key];
        const validEntries = originalEntries.filter((e) => courseIds.has(e.courseId));

        if (validEntries.length !== originalEntries.length) {
          hasChanges = true;
        }

        if (validEntries.length > 0) {
          newTimetable[key] = validEntries;
        }
      });

      if (hasChanges) {
        console.log("Cleaned up orphaned timetable assignments");
        return newTimetable;
      }
      return prev;
    });
  }, [courses, setTimetable]);

  const handleConfirmDelete = useCallback(() => {
    if (slotSelection.courseToDelete) {
      removeCourseFromAllSlots(slotSelection.courseToDelete.id);
      deleteCourse(slotSelection.courseToDelete.id);
      slotSelection.setCourseToDelete(null);
    }
  }, [slotSelection, deleteCourse, removeCourseFromAllSlots]);

  const handleConfirmClearCourses = useCallback(() => {
    clearCourses();
    clearTimetable();
  }, [clearCourses, clearTimetable]);

  const handleConfirmClearTimetable = useCallback(() => {
    clearTimetable();
  }, [clearTimetable]);

  return (
    <TooltipProvider>
      <DndContext {...dragDrop}>
        <SEO />
        <div className="min-h-screen bg-background">
          <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="px-4 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <Link to="/" className="flex items-center gap-2 sm:gap-3">
                  <img
                    src={resolvedTheme === "dark" ? "/unisync-full-white.svg" : "/unisync-full-dark.svg"}
                    alt="UniSync - Return to Landing Page"
                    className="h-8 sm:h-10 w-auto object-contain hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                  <SettingsModal
                    settings={settings}
                    timetable={timetable}
                    onSave={handleSettingsSave}
                  />
                  <ModeToggle />
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-full overflow-x-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="lg:col-span-1 space-y-3 sm:space-y-4">
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex items-start gap-2 text-base sm:text-lg">
                      <BookOpen className="h-4 sm:h-5 w-4 sm:w-5 mt-1 shrink-0" />
                      <span>Available Courses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <GettingStartedSection />

                    <CreditsDisplay
                      totalCredits={totalCredits}
                      scheduledCredits={scheduledCredits}
                    />

                    <Separator />

                    <AddCourseModal courses={courses} onAddCourse={addCourse} />

                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Import Data</p>
                      <div className="grid grid-cols-2 gap-2">
                        <ImportCoursesModal onAddCourse={addCourse} />
                        <ImportTimetableModal
                          courses={courses}
                          onImportTimetable={handleImportTimetable}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          Reference Images
                        </p>
                      </div>
                      <ReferenceImagesDescription />
                      <div className="grid grid-cols-2 gap-2">
                        <TimetableImageUpload onUpload={addImage} />
                        <TimetableImageGallery
                          images={timetableImages}
                          onDeleteImage={deleteImage}
                          onClearImages={clearImages}
                        />
                      </div>
                    </div>

                    <Separator />

                    <Button
                      variant="default"
                      className="w-full gap-2 justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      onClick={handleExportPng}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {isExporting ? "Exporting..." : "Export as PNG"}
                    </Button>
                    {exportError && <p className="text-xs text-destructive">{exportError}</p>}

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => modalState.setClearCoursesDialogOpen(true)}
                        disabled={courses.length === 0}
                        aria-label="Clear all added courses"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear Courses
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => modalState.setClearTimetableDialogOpen(true)}
                        disabled={Object.keys(timetable).length === 0}
                        aria-label="Clear current timetable assignments"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear Timetable
                      </Button>
                    </div>

                    <Separator />

                    <CourseList courses={courses} onDeleteCourse={handleDeleteCourseRequest} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3 min-w-0 h-fit">
                <Card className="h-fit">
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
                      onSlotDoubleClick={handleSlotDoubleClick}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>

          <AssignCourseModal
            key={
              slotSelection.selectedSlot
                ? `${slotSelection.selectedSlot.day}-${slotSelection.selectedSlot.time}`
                : "closed"
            }
            open={modalState.assignModalOpen}
            onOpenChange={modalState.setAssignModalOpen}
            day={slotSelection.selectedSlot?.day ?? null}
            time={slotSelection.selectedSlot?.time ?? null}
            courses={courses}
            assignedEntries={
              slotSelection.selectedSlot
                ? getSlotEntries(
                    createSlotKey(slotSelection.selectedSlot.day, slotSelection.selectedSlot.time),
                  )
                : []
            }
            onAssignCourse={handleAssignCourse}
            onRemoveCourse={handleRemoveCourseFromSlot}
          />

          <DeleteCourseModal
            open={modalState.deleteModalOpen}
            onOpenChange={modalState.setDeleteModalOpen}
            course={slotSelection.courseToDelete}
            timetable={timetable}
            onConfirmDelete={handleConfirmDelete}
          />

          <ClearConfirmationDialog
            open={modalState.clearCoursesDialogOpen}
            onOpenChange={modalState.setClearCoursesDialogOpen}
            title="Clear All Data?"
            description="Are you sure you want to delete ALL courses? This will also clear your entire timetable. This action cannot be undone."
            onConfirm={handleConfirmClearCourses}
          />

          <ClearConfirmationDialog
            open={modalState.clearTimetableDialogOpen}
            onOpenChange={modalState.setClearTimetableDialogOpen}
            title="Clear Timetable?"
            description="Are you sure you want to clear all assignments from the timetable? This action cannot be undone."
            onConfirm={handleConfirmClearTimetable}
          />

          <DragOverlay>
            {dragDrop.activeDragCourse ? (
              <div className="flex items-center justify-between p-3 bg-background rounded-lg shadow-xl border border-primary w-[250px] opacity-90">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">
                      {dragDrop.activeDragCourse.code}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Sec {dragDrop.activeDragCourse.class}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}
