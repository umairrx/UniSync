import { BookOpen, Download, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CourseList } from "@/components/CourseList";
import { AddCourseModal } from "@/components/AddCourseModal";
import { ImportTimetableModal } from "@/components/ImportTimetableModal";
import { ImportCoursesModal } from "@/components/ImportCoursesModal";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { TimetableImageUpload } from "@/components/TimetableImageUpload";
import { TimetableImageGallery } from "@/components/TimetableImageGallery";
import type { Course } from "@/types";

// Static JSX elements hoisted outside component
const GettingStartedSection = () => (
  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm mb-2">
    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
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
    <svg
      className="h-2.5 w-2.5 text-accent-foreground/70 mt-0.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
    <p className="text-[9px] leading-tight text-muted-foreground">
      Upload your university's official timetable image to keep it side-by-side for quick reference.
    </p>
  </div>
);

interface SidebarProps {
  courses: Course[];
  timetable: Record<string, any[]>;
  timetableImages: any[];
  totalCredits: number;
  scheduledCredits: number;
  isExporting: boolean;
  exportError: string | null;
  onAddCourse: (course: any) => void;
  onImportTimetable: (assignments: any[], clearExisting: boolean, missingCourses: any[]) => void;
  onAddImage: (image: any) => void;
  onDeleteImage: (id: string) => void;
  onClearImages: () => void;
  onExportPng: () => void;
  onClearCourses: () => void;
  onClearTimetable: () => void;
  onDeleteCourse: (course: any) => void;
}

export function Sidebar({
  courses,
  timetable,
  timetableImages,
  totalCredits,
  scheduledCredits,
  isExporting,
  exportError,
  onAddCourse,
  onImportTimetable,
  onAddImage,
  onDeleteImage,
  onClearImages,
  onExportPng,
  onClearCourses,
  onClearTimetable,
  onDeleteCourse,
}: SidebarProps) {
  return (
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

          <CreditsDisplay totalCredits={totalCredits} scheduledCredits={scheduledCredits} />

          <Separator />

          <AddCourseModal courses={courses} onAddCourse={onAddCourse} />

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Import Data</p>
            <div className="grid grid-cols-2 gap-2">
              <ImportCoursesModal onAddCourse={onAddCourse} />
              <ImportTimetableModal courses={courses} onImportTimetable={onImportTimetable} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Reference Images</p>
            </div>
            <ReferenceImagesDescription />
            <div className="grid grid-cols-2 gap-2">
              <TimetableImageUpload onUpload={onAddImage} />
              <TimetableImageGallery
                images={timetableImages}
                onDeleteImage={onDeleteImage}
                onClearImages={onClearImages}
              />
            </div>
          </div>

          <Separator />

          <Button
            variant="default"
            className="w-full gap-2 justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform"
            onClick={onExportPng}
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
              onClick={onClearCourses}
              disabled={courses.length === 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Courses
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={onClearTimetable}
              disabled={Object.keys(timetable).length === 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Timetable
            </Button>
          </div>

          <Separator />

          <CourseList courses={courses} onDeleteCourse={onDeleteCourse} />
        </CardContent>
      </Card>
    </div>
  );
}
